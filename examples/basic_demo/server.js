import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Retrieves a fake ad script based on the provided script name.
 * @param {string} scriptName - The name of the ad script.
 * @returns {string} Fake ad script content.
 */
function getFakeAdScript(scriptName) {
  return `console.log("Fake ad script: ${scriptName} loaded");`;
}

/**
 * Starts an Express server that hosts a test page and serves fake ad scripts.
 * @async
 * @function
 * @returns {Promise<import('http').Server>} The HTTP server instance.
 */
export async function startServer() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();

  // Serve static files (e.g., test-page.html) from the "public" directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Serve fake ad scripts under /ads/*
  app.get('/ads/:scriptName', (req, res) => {
    try {
      const { scriptName } = req.params;
      const adScript = getFakeAdScript(scriptName);
      res.type('application/javascript').send(adScript);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to load ad script');
    }
  });

  // Handle 404 for undefined routes
  app.use((req, res) => {
    res.status(404).send('Not Found');
  });

  const port = process.env.PORT || 3000;
  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        resolve(server);
      });
    } catch (error) {
      reject(error);
    }
  });
}