import path from "node:path";
import YAML from "yamljs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta del YAML
const swaggerDocument = YAML.load(
  path.join(__dirname, "../docs/api.yml")
);

export default swaggerDocument;
