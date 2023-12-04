"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_PATH = exports.VAULT_TOKEN = exports.VAULT_URL = void 0;
exports.VAULT_URL = process.env.VAULT_URL || "http://localhost:8200";
exports.VAULT_TOKEN = process.env.VAULT_TOKEN || "hvs.uTQewpCejFvAb5poJmowOq74";
exports.SECRET_PATH = "secret/data/";
