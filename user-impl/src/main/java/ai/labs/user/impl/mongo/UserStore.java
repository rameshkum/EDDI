package ai.labs.user.impl.mongo;

import ai.labs.persistence.IResourceStore;
import ai.labs.serialization.IJsonSerialization;
import ai.labs.user.IUserStore;
import ai.labs.user.model.User;
import ai.labs.utilities.SecurityUtilities;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.types.ObjectId;

import javax.inject.Inject;
import java.io.IOException;

/**
 * @author ginccc
 */
@Slf4j
public class UserStore implements IUserStore {
    private static final String COLLECTION_USERS = "users";
    private final MongoCollection<Document> collection;
    private IJsonSerialization jsonSerialization;

    @Inject
    public UserStore(MongoDatabase database, IJsonSerialization jsonSerialization) {
        collection = database.getCollection(COLLECTION_USERS);
        this.jsonSerialization = jsonSerialization;
    }

    @Override
    public String searchUser(String username) throws IResourceStore.ResourceStoreException, IResourceStore.ResourceNotFoundException {
        Document userDocument = collection.find(new Document("username", username)).first();

        if (userDocument == null) {
            String message = "Resource 'User' not found. (username=%s)";
            message = String.format(message, username);
            throw new IResourceStore.ResourceNotFoundException(message);
        }

        return userDocument.get("_id").toString();
    }

    public User readUser(String userId) throws IResourceStore.ResourceStoreException, IResourceStore.ResourceNotFoundException {
        Document userDocument = collection.find(new Document("_id", new ObjectId(userId))).first();

        if (userDocument == null) {
            String message = "Resource 'User' not found. (userId=%s)";
            message = String.format(message, userId);
            throw new IResourceStore.ResourceNotFoundException(message);
        }

        userDocument.remove("_id");

        return convert(userDocument);

    }

    private User convert(Document userDocument) throws IResourceStore.ResourceStoreException {
        try {
            return jsonSerialization.deserialize(userDocument.toString(), User.class);
        } catch (IOException e) {
            log.debug(e.getLocalizedMessage(), e);
            throw new IResourceStore.ResourceStoreException(e.getLocalizedMessage(), e);
        }
    }


    @Override
    public void updateUser(String userId, User user) throws IResourceStore.ResourceStoreException {
        String jsonUser = serialize(user);
        Document document = Document.parse(jsonUser);

        document.put("_id", new ObjectId(userId));

        collection.insertOne(document);
    }

    @Override
    public String createUser(User user) throws IResourceStore.ResourceStoreException {
        user.setSalt(SecurityUtilities.generateSalt());
        user.setPassword(SecurityUtilities.hashPassword(user.getPassword(), user.getSalt()));

        String jsonUser = serialize(user);
        Document document = Document.parse(jsonUser);

        collection.insertOne(document);

        return document.get("_id").toString();
    }

    private String serialize(User user) throws IResourceStore.ResourceStoreException {
        try {
            return jsonSerialization.serialize(user);
        } catch (IOException e) {
            log.debug(e.getLocalizedMessage(), e);
            throw new IResourceStore.ResourceStoreException("Cannot serialize User entity into json.", e);
        }
    }

    @Override
    public void deleteUser(String userId) {
        collection.deleteOne(new BasicDBObject("_id", new ObjectId(userId)));
    }
}
