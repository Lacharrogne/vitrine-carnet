-- ============================================================================
--  « LES CARNETS » — Import des données du Carnet de sport dans le projet
--  commun. À exécuter APRÈS 0006_sport_schema.sql, dans le projet « Les Carnets ».
-- ----------------------------------------------------------------------------
--  Données de l'ancien compte Sport ced1abaa-… rattachées au compte unique
--  commun : 7036529a-9530-4a08-92f5-a89041d73f49. (Le compte de test 3bbc7ae7-… est ignoré.)
-- ============================================================================

-- ---- workouts (5) ----------------------------------------------------------
insert into public.workouts (id, user_id, title, sport, date, duration_minutes, intensity, feeling, progress, notes, improvement, is_record, details, duration, created_at, updated_at) values
  ('ec1646d2-979f-4816-9c1b-baa45b40861b', '7036529a-9530-4a08-92f5-a89041d73f49', 'Test Randonnée', 'randonnee', '2026-05-21', 50, 'Moyenne', 'Bon', 'stable', 'Objectif prévu : Essaye de gravir l''everest', '', false, '{"pace": "10", "distance": 60, "elevation": 1600, "exercises": "marche tranquille"}'::jsonb, 0, '2026-05-21T21:41:54.771526+00:00', '2026-05-21T21:41:54.771526+00:00'),
  ('05611095-4490-48e7-8be0-9487da52aa8b', '7036529a-9530-4a08-92f5-a89041d73f49', 'Test Marche', 'marche', '2026-05-21', 45, 'Facile', 'Correct', 'first', 'tast', 'tast', false, '{"pace": "8", "distance": 5, "bodyZones": "cardio", "elevation": 7}'::jsonb, 0, '2026-05-21T21:41:54.771526+00:00', '2026-05-21T21:41:54.771526+00:00'),
  ('572d9f85-e497-401d-8ecc-b740e9c2e4c3', '7036529a-9530-4a08-92f5-a89041d73f49', 'Test Trail', 'trail', '2026-05-21', 70, 'Difficile', 'Excellent', 'record', 'super', '', true, '{"pace": "9", "distance": 45, "bodyZones": "Jambes", "elevation": 1500, "exercises": "Petite course en montagne"}'::jsonb, 0, '2026-05-21T21:41:54.771526+00:00', '2026-05-21T21:41:54.771526+00:00'),
  ('eaaa6ff5-cf71-46c7-b871-bdffea73a858', '7036529a-9530-4a08-92f5-a89041d73f49', 'test running', 'course', '2026-05-21', 39, 'Moyenne', 'Bon', 'stable', 'Bonne séance tranquille', 'Garder la même chose', false, '{"pace": "7", "distance": 5, "bodyZones": "cardio", "elevation": 7, "exercises": "Endurance fondamentale"}'::jsonb, 0, '2026-05-21T21:41:54.771526+00:00', '2026-05-21T21:41:54.771526+00:00'),
  ('69d3d533-e7dd-44b6-8e6d-7e1963c475a6', '7036529a-9530-4a08-92f5-a89041d73f49', 'Push', 'musculation', '2026-05-18', 60, 'Moyenne', 'Bon', 'first', '', '', false, '{"strengthExercises": [{"id": "f52c2afb-760b-43b5-9b8e-4cba919c0ce8", "name": "Bench", "reps": "7", "rest": "3", "sets": "3", "notes": "plus orienter force", "weight": "70"}, {"id": "a74fdcf2-0759-4050-96f1-750519cdb099", "name": "Dips", "reps": "8", "rest": "3", "sets": "3", "notes": "", "weight": "PDC"}, {"id": "a87c07d4-c180-4110-80e3-2654d97eb467", "name": "Dev Haltére", "reps": "10", "rest": "3", "sets": "3", "notes": "", "weight": "24"}, {"id": "e71baa21-398a-4273-90fe-28294fe15cd2", "name": "Dev Militaire", "reps": "12", "rest": "3", "sets": "3", "notes": "", "weight": "20"}, {"id": "f0e9c4e3-705f-4e2f-8b0b-cd5a76341d9f", "name": "Ext Triceps", "reps": "8", "rest": "3", "sets": "4", "notes": "", "weight": "60"}, {"id": "9f12623c-83d8-4bfb-89e7-a8b64ed05605", "name": "Elevation Latéral", "reps": "12", "rest": "3", "sets": "4", "notes": "", "weight": "12"}]}'::jsonb, 0, '2026-05-21T21:41:54.771526+00:00', '2026-05-21T21:41:54.771526+00:00')
on conflict (id) do nothing;

-- ---- planned_workouts (4) --------------------------------------------------
insert into public.planned_workouts (id, user_id, title, category, date, duration, objective, details, notes, improvement_idea, created_at) values
  ('f8a95f2b-cbb6-4ccb-9c20-2b22d6e33944', '7036529a-9530-4a08-92f5-a89041d73f49', 'Test Velo', 'velo', '2026-05-24', 200, 'test', '{"pace": "35", "distance": 60, "elevation": 500}'::jsonb, null, null, '2026-05-21T21:41:54.769523+00:00'),
  ('5c93151e-8a6b-4b76-8a10-5bb2dac7b67d', '7036529a-9530-4a08-92f5-a89041d73f49', 'Test VTT', 'vtt', '2026-05-26', 150, '', '{"pace": "15", "distance": 30, "elevation": 500}'::jsonb, null, null, '2026-05-21T21:41:54.769523+00:00'),
  ('160637b1-2d64-4e85-9b25-4ef79b27ddba', '7036529a-9530-4a08-92f5-a89041d73f49', 'Test Natation', 'natation', '2026-05-30', 60, '', '{"pace": "2", "distance": 3000, "swimmingStyle": "Crawl"}'::jsonb, null, null, '2026-05-21T21:41:54.769523+00:00'),
  ('e8581336-4380-40e8-9bb6-14b2f1b2f73d', '7036529a-9530-4a08-92f5-a89041d73f49', 'Test Hiit', 'hiit', '2026-06-02', 49, '', '{"bodyZones": "test", "exercises": "dd"}'::jsonb, null, null, '2026-05-21T21:41:54.769523+00:00')
on conflict (id) do nothing;

-- ---- weekly_goals (1) ------------------------------------------------------
insert into public.weekly_goals (user_id, target_minutes, updated_at) values
  ('7036529a-9530-4a08-92f5-a89041d73f49', 180, '2026-05-16T22:30:45.777044+00:00')
on conflict (user_id) do update set target_minutes = excluded.target_minutes, updated_at = excluded.updated_at;

-- ---- health_profiles (1) ---------------------------------------------------
insert into public.health_profiles (user_id, height_cm, weight_kg, age, activity_level, main_goal, updated_at) values
  ('7036529a-9530-4a08-92f5-a89041d73f49', 200, 105, 25, 'actif', 'prise-de-muscle', '2026-05-23T11:52:04.798+00:00')
on conflict (user_id) do update set height_cm = excluded.height_cm, weight_kg = excluded.weight_kg, age = excluded.age, activity_level = excluded.activity_level, main_goal = excluded.main_goal, updated_at = excluded.updated_at;
