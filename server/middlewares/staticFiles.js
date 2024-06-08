import express from 'express';
import path from 'path';

const __dirname = path.resolve();

export default function staticFiles(app) {
  app.use(express.static(path.join(__dirname, 'public')));
}
