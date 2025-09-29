/*
 Navicat Premium Data Transfer

 Source Server         : cloudDB
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : 933b6ed736ba.c.methodot.com:30962
 Source Schema         : pageplug

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001

 Date: 09/06/2023 19:00:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户名',
  `power` int(255) NULL DEFAULT NULL COMMENT '力量',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '萧炎', 100);
INSERT INTO `user` VALUES (6, '美杜莎', 99);
INSERT INTO `user` VALUES (7, '薰儿', 99);
INSERT INTO `user` VALUES (8, '海波东', 80);
INSERT INTO `user` VALUES (9, '小医仙', 98);
INSERT INTO `user` VALUES (10, '顾念', 101);
INSERT INTO `user` VALUES (11, '药老', 90);
INSERT INTO `user` VALUES (12, 'pageplug', 99999);
INSERT INTO `user` VALUES (15, '测试3', 3);
INSERT INTO `user` VALUES (16, '测试4', 4);
INSERT INTO `user` VALUES (18, '测试5', 5);
INSERT INTO `user` VALUES (19, '测试6', 6);
INSERT INTO `user` VALUES (20, '测试7', 7);
INSERT INTO `user` VALUES (21, '测试8', 8);
INSERT INTO `user` VALUES (22, '测试9', 9);
INSERT INTO `user` VALUES (23, '测试10', 10);

SET FOREIGN_KEY_CHECKS = 1;
