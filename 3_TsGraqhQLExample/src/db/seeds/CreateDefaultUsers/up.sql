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
    '$argon2i$v=19$m=4096,t=3,p=1$xX43mhLMW2CnTo6IKxrN9Q$b4RA2T2T5Ghkn9IO3cVREa9jWk9ysZi3d1EJgi488xE',
    1,
    'admin',
    'user',
    'admin@seguridad.ucu.com'
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
    'funcionario1',
    '$argon2i$v=19$m=4096,t=3,p=1$/wPjgz7tnsRvznqmrWO/LQ$2wxdQG8zB0wZUalsWZ5DkJw86gkPL3Y1g0YW6XdjmIA',
    1,
    'funcionario',
    'uno',
    'funcionario1@seguridad.ucu.com'
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
    '$argon2i$v=19$m=4096,t=3,p=1$Wrj63YE26p9Zy6DvX0b2Ug$A6xdygV6LYW98xz7eiwund0Qyr5pqSF5dSmuspKbbpo',
    1,
    'usuario',
    'uno',
    'usuario@seguridad.ucu.com'
  );
