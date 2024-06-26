SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: device_platforms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.device_platforms (
    id integer NOT NULL,
    device_id uuid,
    platform_id integer NOT NULL,
    meta jsonb,
    user_id uuid
);


--
-- Name: device_platforms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.device_platforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: device_platforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.device_platforms_id_seq OWNED BY public.device_platforms.id;


--
-- Name: device_platforms_platform_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.device_platforms_platform_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: device_platforms_platform_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.device_platforms_platform_id_seq OWNED BY public.device_platforms.platform_id;


--
-- Name: devices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.devices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    device_name character varying(64),
    owner uuid
);


--
-- Name: platforms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platforms (
    id integer NOT NULL,
    name character varying(64),
    image text
);


--
-- Name: platforms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.platforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: platforms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.platforms_id_seq OWNED BY public.platforms.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(64),
    user_id uuid,
    device_id uuid,
    is_active boolean
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(128) NOT NULL,
    password text NOT NULL,
    email character varying(128) NOT NULL
);


--
-- Name: device_platforms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_platforms ALTER COLUMN id SET DEFAULT nextval('public.device_platforms_id_seq'::regclass);


--
-- Name: device_platforms platform_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_platforms ALTER COLUMN platform_id SET DEFAULT nextval('public.device_platforms_platform_id_seq'::regclass);


--
-- Name: platforms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platforms ALTER COLUMN id SET DEFAULT nextval('public.platforms_id_seq'::regclass);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- Name: platforms platforms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platforms
    ADD CONSTRAINT platforms_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: device_platforms_device_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX device_platforms_device_id ON public.device_platforms USING btree (device_id);


--
-- Name: device_platforms_device_id_platform_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX device_platforms_device_id_platform_id_idx ON public.device_platforms USING btree (device_id, platform_id);


--
-- Name: device_platforms_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX device_platforms_user_id ON public.device_platforms USING btree (platform_id, user_id);


--
-- Name: devices_owner_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX devices_owner_idx ON public.devices USING btree (owner);


--
-- Name: projects_device_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX projects_device_id_idx ON public.projects USING btree (device_id);


--
-- Name: device_platforms device_platforms_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_platforms
    ADD CONSTRAINT device_platforms_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- Name: device_platforms device_platforms_platform_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_platforms
    ADD CONSTRAINT device_platforms_platform_id_fkey FOREIGN KEY (platform_id) REFERENCES public.platforms(id);


--
-- Name: device_platforms device_platforms_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.device_platforms
    ADD CONSTRAINT device_platforms_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: devices devices_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_owner_fkey FOREIGN KEY (owner) REFERENCES public.users(id);


--
-- Name: projects projects_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20240613152344'),
    ('20240619204714'),
    ('20240626141658'),
    ('20240626142323'),
    ('20240626144942'),
    ('20240627091549'),
    ('20240627091703');
