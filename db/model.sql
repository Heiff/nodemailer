CREATE DATABASE email1;

CREATE TABLE auth(
    id serial not null primary key,
    username varchar(64) not null,
    email text not null,
    password text not null,
    verify boolean not null
);