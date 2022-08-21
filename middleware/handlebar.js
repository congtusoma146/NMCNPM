const exphbs= require('express-handlebars');
const { helpers } = require('handlebars');

const exphbs_sections = require('express-handlebars-sections');

module.exports = app => {
    const hbs = exphbs.create({
        defaultLayout: 'index',
        extname: 'hbs'    
    });
    
    exphbs_sections(hbs);
    app.engine('hbs',hbs.engine);
    app.set('view engine', 'hbs');
    app.set("views","./views");
}