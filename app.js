const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dir = require('./src/helpers/dirConfig');
const {delegateCorsOptions} = require(dir.helpers + '/cors');
const userRoutes = require(dir.routes + '/user.routes');
const {AppError, handleError} = require(dir.helpers + '/error');
const {STATUS_CODES} = require(dir.helpers + '/constants');

dotenv.config();

const PORT = process.env.PORT || 8081;
const app = express();

// Middlewares
app.use(express.json());
app.use(fileUpload());

// Serving static files
app.use('/static', express.static(dir.static));

// Routes
app.use('/users', cors(delegateCorsOptions), userRoutes);

// Error handling
app.all('*', (req, _, passToNext) => {
    passToNext(
        new AppError(
            `Cant find ${req.method} ${req.originalUrl} on this server!`,
            STATUS_CODES.NOT_FOUND,
        ),
    );
});

app.use((err, req, res, _) => {
    handleError(err, req, res, _);
});

async function runServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Server successfully started on PORT: ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}

//comment to distinguish between branches
runServer();
