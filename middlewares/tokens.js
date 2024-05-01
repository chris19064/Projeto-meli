const meli = require('mercadolibre');
require('dotenv').config();
const express = require('express');
const app = express();

var count = 0;

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const tokens = {
access_token: null,
refresh_token: null,
expires: null,
};

// Função para definir os novos tokens e a data de expiração
const setTokens = (newTokens) => {
const expirationDate = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);
tokens.expires = expirationDate;
tokens.access_token = newTokens.access_token;
tokens.refresh_token = newTokens.refresh_token; // Armazenar o refresh token
};

// Middleware para validar o token de acesso
const validateToken = (req, res, next) => {

 /* if (req.path === '/home') {
    console.log("estou no if req path");
    return next();
    } */

  console.log("estou no validate token");
if (req.session.user) {
  console.log("estou no if req.sessio.user");
  console.log(tokens.access_token);
  
  
if ((!tokens.access_token || new Date() >= tokens.expires) &&  this.count == 0) {
  this.count = 1;
  console.log("entrou no if !token", this.count) ;
const redirect_uri = REDIRECT_URI;
const code = req.query;

console.log ("este é o", this.code);
const meliObject = new meli.Meli(CLIENT_ID, CLIENT_SECRET, tokens.access_token, tokens.refresh_token);

// Se o código de autorização estiver presente, troque-o por um token de acesso
if (code) {
  console.log("estou no if code");
  console.log(tokens);
meliObject.authorize(code, redirect_uri, (error, response) => {
if (error) {
return res.status(401).send('Falha na autenticação');
}
setTokens(response);
res.locals.access_token = tokens.access_token;
res.redirect('https://localhost:3000/home');
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