import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import personasRoutes from './routes/personas.routes.js'
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/tasks.routes.js'
import { sequelize } from './database.js'

//Intialization
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use("/api",authRoutes);
app.use("/api",taskRoutes);


//Routes
app.get('/', (req, res)=>{
    res.render('index')
})

app.use(personasRoutes);

//Public files
app.use(express.static(join(__dirname, 'public')));

//Run Server
sequelize.sync({ alter: true }) // Esto sincroniza la base de datos
    .then(() => {
        console.log('Database & tables synced!');
        app.listen(app.get('port'), () => 
            console.log('Server listening on port', app.get('port'))
        );
    })
    .catch(error => {
        console.error('Unable to sync database:', error.message);
    });

export default app;