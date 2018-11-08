"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 保存所有用户连接
 *
 * - key 是用户的唯一凭证
 */
exports.userCollection = new Map();
/**
 * 保存当前所有用户的昵称和对应的id
 */
exports.userNickNameCollection = new Map();
