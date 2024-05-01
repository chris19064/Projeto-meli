const meli = require('mercadolibre');
require('dotenv').config();

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const tokens = {
access_token: null,
refresh_token: null,
expires: null,
};

// Função para definir os novos tokens e a data de expiração
const setTokens = (newTokens) => {
const expiresIn = newTokens.expires_in; // Tempo em segundos até o token expirar
const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
tokens.expires = expirationDate;
tokens.access_token = newTokens.access_token;
tokens.refresh_token = newTokens.refresh_token; // Armazenar o refresh token
};

// Middleware para validar o token de acesso
const validateToken = (req, res, next) => {
if (req.session.user) {
  console.log(tokens);
if (!tokens.access_token || new Date() >= tokens.expires) {
const redirect_uri = REDIRECT_URI + req.baseUrl + req.path;
const { code } = req.query;
console.log(code);
const meliObject = new meli.Meli(CLIENT_ID, CLIENT_SECRET, tokens.access_token, tokens.refresh_token);

// Se o código de autorização estiver presente, troque-o por um token de acesso
if (code) {
  console.log(tokens);
meliObject.authorize(code, redirect_uri, (error, response) => {
if (error) {
return res.status(401).send('Falha na autenticação');
}
setTokens(response);
res.locals.access_token = tokens.access_token;
res.redirect(redirect_uri);
});
} else {
// Se não houver token de acesso ou estiver expirado, redirecione para a URL de autenticação
console.log("não há token de acesso, redirecionando para auth");
res.redirect(meliObject.getAuthURL(redirect_uri));
}
} else {
// Se o token de acesso for válido, continue com a solicitação
res.locals.access_token = tokens.access_token;
next();
}
} else {
// Se o usuário não estiver logado, redirecione para a página de login
res.redirect('/');
}
};

module.exports = {
validateToken
};