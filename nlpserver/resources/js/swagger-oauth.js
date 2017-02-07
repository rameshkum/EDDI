function handleLogin() {
    var e = [], o = window.swaggerUiAuth.authSchemes || window.swaggerUiAuth.securityDefinitions;
    if (o) {
        var i, a = o;
        for (i in a) {
            var n = a[i];
            if ("oauth2" === n.type && n.scopes) {
                var t;
                if (Array.isArray(n.scopes)) {
                    var p;
                    for (p = 0; p < n.scopes.length; p++)e.push(n.scopes[p])
                } else for (t in n.scopes)e.push({scope: t, description: n.scopes[t], OAuthSchemeKey: i})
            }
        }
    }
    for (window.swaggerUi.api && window.swaggerUi.api.info && (appName = window.swaggerUi.api.info.title), $(".api-popup-dialog").remove(), popupDialog = $(['<div class="api-popup-dialog">', '<div class="api-popup-title">Select OAuth2.0 Scopes</div>', '<div class="api-popup-content">', "<p>Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.", '<a href="#">Learn how to use</a>', "</p>", "<p><strong>" + appName + "</strong> API requires the following scopes. Select which ones you want to grant to Swagger UI.</p>", '<ul class="api-popup-scopes">', "</ul>", '<p class="error-msg"></p>', '<div class="api-popup-actions"><button class="api-popup-authbtn api-button green" type="button">Authorize</button><button class="api-popup-cancel api-button gray" type="button">Cancel</button></div>', "</div>", "</div>"].join("")), $(document.body).append(popupDialog), popup = popupDialog.find("ul.api-popup-scopes").empty(), p = 0; p < e.length; p++)t = e[p], str = '<li><input type="checkbox" id="scope_' + p + '" scope="' + t.scope + '"" oauthtype="' + t.OAuthSchemeKey + '"/><label for="scope_' + p + '">' + t.scope, t.description && ($.map(o, function (e, o) {
        return o
    }).length > 1 ? str += '<br/><span class="api-scope-desc">' + t.description + " (" + t.OAuthSchemeKey + ")</span>" : str += '<br/><span class="api-scope-desc">' + t.description + "</span>"), str += "</label></li>", popup.append(str);
    var r = $(window), c = r.width(), s = r.height(), l = r.scrollTop(), d = popupDialog.outerWidth(), u = popupDialog.outerHeight(), h = (s - u) / 2 + l, g = (c - d) / 2;
    popupDialog.css({
        top: (h < 0 ? 0 : h) + "px",
        left: (g < 0 ? 0 : g) + "px"
    }), popupDialog.find("button.api-popup-cancel").click(function () {
        popupMask.hide(), popupDialog.hide(), popupDialog.empty(), popupDialog = []
    }), $("button.api-popup-authbtn").unbind(), popupDialog.find("button.api-popup-authbtn").click(function () {
        popupMask.hide(), popupDialog.hide();
        var e, o = window.swaggerUi.api.authSchemes, i = window.location, a = location.pathname.substring(0, location.pathname.lastIndexOf("/")), n = i.protocol + "//" + i.host + a + "/o2c.html", t = window.oAuthRedirectUrl || n, p = null, r = [], c = popup.find("input:checked"), s = [];
        for (k = 0; k < c.length; k++) {
            var l = $(c[k]).attr("scope");
            r.indexOf(l) === -1 && r.push(l);
            var d = $(c[k]).attr("oauthtype");
            s.indexOf(d) === -1 && s.push(d)
        }
        window.enabledScopes = r;
        for (var u in o)if (o.hasOwnProperty(u) && s.indexOf(u) != -1) {
            var h = o[u].flow;
            if ("oauth2" !== o[u].type || !h || "implicit" !== h && "accessCode" !== h) {
                if ("oauth2" === o[u].type && h && "application" === h) {
                    var g = o[u];
                    return window.swaggerUi.tokenName = g.tokenName || "access_token", void clientCredentialsFlow(r, g.tokenUrl, u)
                }
                if (o[u].grantTypes) {
                    var c = o[u].grantTypes;
                    for (var w in c)if (c.hasOwnProperty(w) && "implicit" === w) {
                        var g = c[w];
                        g.loginEndpoint.url;
                        p = g.loginEndpoint.url + "?response_type=token", window.swaggerUi.tokenName = g.tokenName
                    } else if (c.hasOwnProperty(w) && "accessCode" === w) {
                        var g = c[w];
                        g.tokenRequestEndpoint.url;
                        p = g.tokenRequestEndpoint.url + "?response_type=code", window.swaggerUi.tokenName = g.tokenName
                    }
                }
            } else {
                var g = o[u];
                p = g.authorizationUrl + "?response_type=" + ("implicit" === h ? "token" : "code"), window.swaggerUi.tokenName = g.tokenName || "access_token", window.swaggerUi.tokenUrl = "accessCode" === h ? g.tokenUrl : null, e = u
            }
        }
        redirect_uri = t, p += "&redirect_uri=" + encodeURIComponent(t), p += "&realm=" + encodeURIComponent(realm), p += "&client_id=" + encodeURIComponent(clientId), p += "&scope=" + encodeURIComponent(r.join(scopeSeparator)), p += "&state=" + encodeURIComponent(e);
        for (var u in additionalQueryStringParams)p += "&" + u + "=" + encodeURIComponent(additionalQueryStringParams[u]);
        window.open(p)
    }), popupMask.show(), popupDialog.show()
}
function handleLogout() {
    for (key in window.swaggerUi.api.clientAuthorizations.authz)window.swaggerUi.api.clientAuthorizations.remove(key);
    window.enabledScopes = null, $(".api-ic.ic-on").addClass("ic-off"), $(".api-ic.ic-on").removeClass("ic-on"), $(".api-ic.ic-warning").addClass("ic-error"), $(".api-ic.ic-warning").removeClass("ic-warning")
}
function initOAuth(e) {
    var o = e || {}, i = [];
    return appName = o.appName || i.push("missing appName"), popupMask = o.popupMask || $("#api-common-mask"), popupDialog = o.popupDialog || $(".api-popup-dialog"), clientId = o.clientId || i.push("missing client id"), clientSecret = o.clientSecret || null, realm = o.realm || i.push("missing realm"), scopeSeparator = o.scopeSeparator || " ", additionalQueryStringParams = o.additionalQueryStringParams || {}, i.length > 0 ? void log("auth unable initialize oauth: " + i) : ($("pre code").each(function (e, o) {
            hljs.highlightBlock(o)
        }), $(".api-ic").unbind(), void $(".api-ic").click(function (e) {
            $(e.target).hasClass("ic-off") ? handleLogin() : handleLogout()
        }))
}
function clientCredentialsFlow(e, o, i) {
    var a = {client_id: clientId, client_secret: clientSecret, scope: e.join(" "), grant_type: "client_credentials"};
    $.ajax({
        url: o, type: "POST", data: a, success: function (e, o, a) {
            onOAuthComplete(e, i)
        }, error: function (e, o, i) {
            onOAuthComplete("")
        }
    })
}
var appName, popupMask, popupDialog, clientId, realm, redirect_uri, clientSecret, scopeSeparator, additionalQueryStringParams;
window.processOAuthCode = function (e) {
    var o = e.state, i = window.location, a = location.pathname.substring(0, location.pathname.lastIndexOf("/")), n = i.protocol + "//" + i.host + a + "/o2c.html", t = window.oAuthRedirectUrl || n, p = {
        client_id: clientId,
        code: e.code,
        grant_type: "authorization_code",
        redirect_uri: t
    };
    clientSecret && (p.client_secret = clientSecret), $.ajax({
        url: window.swaggerUiAuth.tokenUrl,
        type: "POST",
        data: p,
        success: function (e, i, a) {
            onOAuthComplete(e, o)
        },
        error: function (e, o, i) {
            onOAuthComplete("")
        }
    })
}, window.onOAuthComplete = function (e, o) {
    if (e)if (e.error) {
        var i = $("input[type=checkbox],.secured");
        i.each(function (e) {
            i[e].checked = !1
        }), alert(e.error)
    } else {
        var a = e[window.swaggerUiAuth.tokenName];
        if (o || (o = e.state), a) {
            var n = null;
            $.each($(".auth .api-ic .api_information_panel"), function (e, o) {
                var i = o;
                if (i && i.childNodes) {
                    var a = [];
                    $.each(i.childNodes, function (e, o) {
                        var i = o.innerHTML;
                        i && a.push(i)
                    });
                    for (var t = [], p = 0; p < a.length; p++) {
                        var r = a[p];
                        window.enabledScopes && window.enabledScopes.indexOf(r) == -1 && t.push(r)
                    }
                    t.length > 0 ? (n = o.parentNode.parentNode, $(n.parentNode).find(".api-ic.ic-on").addClass("ic-off"), $(n.parentNode).find(".api-ic.ic-on").removeClass("ic-on"), $(n).find(".api-ic").addClass("ic-warning"), $(n).find(".api-ic").removeClass("ic-error")) : (n = o.parentNode.parentNode, $(n.parentNode).find(".api-ic.ic-off").addClass("ic-on"), $(n.parentNode).find(".api-ic.ic-off").removeClass("ic-off"), $(n).find(".api-ic").addClass("ic-info"), $(n).find(".api-ic").removeClass("ic-warning"), $(n).find(".api-ic").removeClass("ic-error"))
                }
            }), "undefined" != typeof window.swaggerUi && (window.swaggerUi.api.clientAuthorizations.add(window.swaggerUiAuth.OAuthSchemeKey, new SwaggerClient.ApiKeyAuthorization("Authorization", "Bearer " + a, "header")), window.swaggerUi.load())
        }
    }
};