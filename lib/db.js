import { promises as fs } from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data', 'db');

// Ensure DB directory exists
async function ensureDbDir() {
    try {
        await fs.access(DB_DIR);
    } catch {
        await fs.mkdir(DB_DIR, { recursive: true });
    }
}

export async function readDB(filename) {
    await ensureDbDir();
    const filePath = path.join(DB_DIR, filename);

    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Return empty array if file doesn't exist
        if (error.code === 'ENOENT') {
            await writeDB(filename, []);
            return [];
        }
        throw error;
    }
}

export async function writeDB(filename, data) {
    await ensureDbDir();
    const filePath = path.join(DB_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Generate unique ID
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
