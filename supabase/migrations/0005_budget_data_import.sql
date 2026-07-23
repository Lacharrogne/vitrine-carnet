-- ============================================================================
--  « LES CARNETS » — Import des données du Carnet de budget dans le projet
--  commun. À exécuter APRÈS 0004_budget_schema.sql, dans le projet « Les
--  Carnets ».
-- ----------------------------------------------------------------------------
--  Toutes les données de l'ancien projet Budget appartenaient à un seul
--  utilisateur (8b25bd5e-8e09-46e6-9999-20085a40f710). On les rattache au
--  compte unique commun : 7036529a-9530-4a08-92f5-a89041d73f49.
--
--  Les `id` de comptes sont conservés pour que les paiements récurrents
--  restent reliés. Tables vides côté source (transactions, monthly_budgets,
--  debts, saving_goals, sinking_funds) : rien à importer.
-- ============================================================================

-- ---- accounts (4) ----------------------------------------------------------
insert into public.accounts (id, user_id, name, type, balance, emoji, color_class, holder, created_at, updated_at) values
  ('c565efef-64fb-41e4-9001-30ac92cce75a', '7036529a-9530-4a08-92f5-a89041d73f49', 'LEP', 'savings', 1200, '💰', 'bg-emerald-50 text-emerald-800 border-emerald-100', 'Maxime', '2026-06-06T19:32:21.627095+00:00', '2026-07-04T21:58:36.978248+00:00'),
  ('d3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', '7036529a-9530-4a08-92f5-a89041d73f49', 'Boursorama CHLOE', 'current', 507.04, '🏦', 'bg-blue-50 text-blue-800 border-blue-100', 'Chloé', '2026-06-28T02:01:45.49325+00:00', '2026-07-04T22:00:51.026266+00:00'),
  ('0cc057c4-c2ff-47c0-859a-fc6c1ae379ec', '7036529a-9530-4a08-92f5-a89041d73f49', 'Bousorama MAXIME', 'current', 18.47, '🏦', 'bg-blue-50 text-blue-800 border-blue-100', 'Maxime', '2026-06-06T18:51:07.578512+00:00', '2026-07-04T22:01:05.360147+00:00'),
  ('81d1246e-b669-442f-b70f-0b2c39148beb', '7036529a-9530-4a08-92f5-a89041d73f49', 'Trade Republic', 'current', 65.9, '📈', 'bg-blue-50 text-blue-800 border-blue-100', 'Maxime', '2026-06-23T20:34:15.206663+00:00', '2026-07-19T23:07:33.851983+00:00')
on conflict (id) do nothing;

-- ---- recurring_payments (14) -----------------------------------------------
insert into public.recurring_payments (id, user_id, account_id, title, amount, category, day_of_month, is_active, type, created_at, updated_at) values
  ('fe31e2fe-9be4-4d48-9f8e-03b542519688', '7036529a-9530-4a08-92f5-a89041d73f49', 'd3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', 'Maaf Assurance Logement', 23.35, 'housing', 4, true, 'expense', '2026-07-04T22:03:55.022447+00:00', '2026-07-04T22:03:55.022447+00:00'),
  ('7b5e4b09-95f5-4994-84a7-9c47c4d4dec0', '7036529a-9530-4a08-92f5-a89041d73f49', 'd3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', 'MGEN', 30.33, 'health', 4, true, 'expense', '2026-07-04T22:04:43.595122+00:00', '2026-07-04T22:04:43.595122+00:00'),
  ('c2b3332b-1d01-4b94-b0d7-439aac8daf64', '7036529a-9530-4a08-92f5-a89041d73f49', 'd3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', 'Orange TEL', 25.99, 'subscriptions', 4, true, 'expense', '2026-07-04T22:05:24.315386+00:00', '2026-07-04T22:05:24.315386+00:00'),
  ('4c6264b6-f049-4054-87b2-a1304ec4afe3', '7036529a-9530-4a08-92f5-a89041d73f49', 'd3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', 'Navigo', 90.8, 'transport', 3, true, 'expense', '2026-07-04T22:05:53.893925+00:00', '2026-07-04T22:05:53.893925+00:00'),
  ('b51dcbd7-4b55-486d-8c5f-ac92c80d4c7b', '7036529a-9530-4a08-92f5-a89041d73f49', 'd3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', 'Basic-Fit', 34.99, 'other', 12, true, 'expense', '2026-07-04T22:07:25.753159+00:00', '2026-07-04T22:07:25.753159+00:00'),
  ('e7ceab5c-dc90-4644-a9f9-f527ddd61870', '7036529a-9530-4a08-92f5-a89041d73f49', 'd3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', 'ENGIE', 86, 'housing', 29, true, 'expense', '2026-07-04T22:07:53.78684+00:00', '2026-07-04T22:07:53.78684+00:00'),
  ('24662819-bead-4180-be1f-540ce7fa6b02', '7036529a-9530-4a08-92f5-a89041d73f49', 'd3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', 'Orange FIBRE', 30.99, 'subscriptions', 8, true, 'expense', '2026-07-04T22:09:00.392882+00:00', '2026-07-04T22:09:00.392882+00:00'),
  ('e5a6658e-adb9-44ae-ae06-91aa76a02845', '7036529a-9530-4a08-92f5-a89041d73f49', '0cc057c4-c2ff-47c0-859a-fc6c1ae379ec', 'Basic-Fit', 24.99, 'other', 3, true, 'expense', '2026-07-04T22:11:58.202198+00:00', '2026-07-04T22:11:58.202198+00:00'),
  ('698b0042-9ca6-4e4e-86ef-53f230e8cbac', '7036529a-9530-4a08-92f5-a89041d73f49', '0cc057c4-c2ff-47c0-859a-fc6c1ae379ec', 'Amazon', 6.99, 'subscriptions', 8, true, 'expense', '2026-07-04T22:12:41.265344+00:00', '2026-07-04T22:12:41.265344+00:00'),
  ('c88b8bed-95b0-482c-bd3f-1593d98270b7', '7036529a-9530-4a08-92f5-a89041d73f49', '0cc057c4-c2ff-47c0-859a-fc6c1ae379ec', 'Orange TEL', 20.99, 'subscriptions', 26, true, 'expense', '2026-07-04T22:13:41.314095+00:00', '2026-07-04T22:13:41.314095+00:00'),
  ('83f8dbdc-01b4-4f93-9dec-d19e56f0436d', '7036529a-9530-4a08-92f5-a89041d73f49', '81d1246e-b669-442f-b70f-0b2c39148beb', 'Canal+', 21.99, 'subscriptions', 2, true, 'expense', '2026-07-04T22:17:05.272816+00:00', '2026-07-04T22:17:05.272816+00:00'),
  ('30e25554-7736-40e4-a1bb-01da9cdc75e7', '7036529a-9530-4a08-92f5-a89041d73f49', '81d1246e-b669-442f-b70f-0b2c39148beb', 'Disney+', 6.99, 'subscriptions', 14, true, 'expense', '2026-07-04T22:18:34.843556+00:00', '2026-07-04T22:18:34.843556+00:00'),
  ('2503a814-076e-4921-97c1-6f4da946bc30', '7036529a-9530-4a08-92f5-a89041d73f49', '81d1246e-b669-442f-b70f-0b2c39148beb', 'Chat GPT', 23, 'subscriptions', 15, true, 'expense', '2026-07-04T22:19:07.093218+00:00', '2026-07-04T22:19:07.093218+00:00'),
  ('45c8f8cc-6921-4313-bc09-98d942f495fc', '7036529a-9530-4a08-92f5-a89041d73f49', 'd3dd29f9-f703-4e1c-8567-ac0d7c5b10f4', 'Loyer', 853.84, 'housing', 5, true, 'expense', '2026-07-04T22:09:53.902375+00:00', '2026-07-08T21:39:36.867007+00:00')
on conflict (id) do nothing;

-- ---- investments (1) -------------------------------------------------------
insert into public.investments (id, user_id, title, emoji, type, platform, invested_amount, current_value, note, created_at, updated_at) values
  ('244fa905-ea1e-4416-9406-2c28116e79fa', '7036529a-9530-4a08-92f5-a89041d73f49', 'MSI WORLD', '📈', 'etf', 'PEA', 100, 155, null, '2026-06-06T19:26:17.729221+00:00', '2026-06-06T19:27:19.886017+00:00')
on conflict (id) do nothing;
