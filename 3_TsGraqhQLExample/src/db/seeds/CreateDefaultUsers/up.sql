INSERT INTO
  `user`(
    `id`,
    `username`,
    `password`,
    `enabled`,
    `firstName`,
    `lastName`,
    `email`
  )
VALUES
  (
    '06ab86cb-52cf-4b6a-ac19-0d62e0307dc6',
    'admin',
    '$argon2i$v=19$m=4096,t=3,p=1$MTBKRkhlMXlrNU9hVWZBTQ$0++JDeYSWZ0GkXXKgvZMgA',
    1,
    'admin',
    'user',
    'admin@example.com'
  );

INSERT INTO
  `user_roles_role`(`userId`, `roleId`)
VALUES
  (
    '06ab86cb-52cf-4b6a-ac19-0d62e0307dc6',
    '48f76d11-2932-4536-9198-7ce0ce4bb1c7'
  );
INSERT INTO
  `user`(
    `id`,
    `username`,
    `password`,
    `enabled`,
    `firstName`,
    `lastName`,
    `email`
  )
VALUES
  (
    '48f75e89-0f7f-4d82-8c3a-8a2a45ecdd09',
    'funcionario',
    '$argon2i$v=19$m=4096,t=3,p=1$N0pNbWJzSnZoSk9ubFdJVw$7p4JA2zUyeUurWHSZ1PQ1A',
    1,
    'funcionario',
    'uno',
    'funcionario@admin@example.com'
  );

INSERT INTO
  `user_roles_role`(`userId`, `roleId`)
VALUES
  (
    '48f75e89-0f7f-4d82-8c3a-8a2a45ecdd09',
    '7b5ec802-5923-4a1b-b9d1-2f522ad6c6a3'
  );
INSERT INTO
  `user`(
    `id`,
    `username`,
    `password`,
    `enabled`,
    `firstName`,
    `lastName`,
    `email`
  )
VALUES
  (
    'eb273257-f77a-493b-a10b-5f7e874e41c6',
    'usuario1',
    '$argon2i$v=19$m=4096,t=3,p=1$TEgzU0pBMGswcm5qaVVhNg$U+R7nIGEQDgOPsJpQQejlA',
    1,
    'usuario',
    'uno',
    'usuario@seguridad.ucu.com'
  );
