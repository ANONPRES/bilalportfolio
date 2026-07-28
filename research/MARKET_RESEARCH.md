# Исследование: продукт для соло-разработчика

**Дата:** 2026-07-28  
**KPI:** максимальная вероятность реальных денег  
**Ограничения:** 1 разработчик, без инвестиций, software only, без курсов/крипты/арбитража

**Состав «команды»:** Market Researcher · Solo Founder · Architect · Growth · Critic

---

## Вердикт заранее (чтобы не читать 40 страниц зря)

**Этап 7 — честный ответ: выдающегося победителя нет.**

Почти все ниши с подтверждённой готовностью платить в 2025–2026 уже забиты клонами: отзывы (EN и RU), dunning, screenshot API, social schedulers, testimonials, feedback boards, WB-автоответы, rank trackers, uptime.

Есть **кандидаты с ненулевой вероятностью денег**. Нет идеи, которая одновременно:

- имеет слабую конкуренцию,
- подтверждённый спрос,
- строится за 2–8 недель одним человеком,
- и реалистично тянет к $10k MRR.

Ниже — полное исследование, убитые идеи, и **один кандидат на валидацию** (не на код). Код продукта писать рано.

---

## Этап 1. Источники исследования

Изучены (выборочно + глубоко по самым денежным нишам):

| Источник | Что искали |
|---|---|
| IndieHackers / Starter Story / MRR Story | Что реально вышло на $5–25k MRR у соло |
| Hacker News (Ask HN + Algolia) | Ручные боли, «I'd pay $10–20» |
| Reddit (через агрегаты PainOnSocial, отраслевые треды) | Жалобы фрилансеров, агентств, Shopify |
| Product / marketplace | VS Code, JetBrains, Chrome Web Store |
| Конкурентные лендинги и pricing | Churnkey, DashThis, Senja, MPSTATS, NiceJob, Grade.us |
| RU: vc.ru, MPAgency, Telegram-продукты | Маркетплейсы, отзывы, самозанятые |
| GitHub / changelog / roadmap | Дыры в существующих инструментах |

### Паттерны реальных денег (не идей)

1. **BlogToPin** — узкая автоматизация одного marketing-канала → ~$15k MRR (соло).
2. **Post Bridge** — «upload once, post everywhere» без enterprise-балласта → ~$18k MRR.
3. **WriteStack** — pivot на Substack Notes после интервью → ~$9.3k MRR / $110k ARR.
4. **Notion↔Sheets sync** — marketplace + SEO → ~$9k MRR.
5. **Conductor** — больная интеграция (QuickBooks Desktop) для vertical SaaS → ~$25k MRR.
6. **Niche VS Code** (пример SupaQuery) — freemium + license → заявленные ~$4–7k/mo на нишевых расширениях.
7. **LLM Pulse (GEO)** — mid-five-figure MRR за <1 год, но **команда из 3**, не соло.

**Вывод Founder:** деньги есть в «одной болезненной рутине с измеримым ROI», не в «ещё одном AI».  
**Вывод Critic:** к 2026 почти каждая такая рутина уже имеет 5–20 конкурентов.

---

## Этап 2. ≥100 повторяющихся проблем

Формат: **кто · частота · как решают · почему плохо · платят?**

### A. Биллинг / деньги SaaS (1–15)

1. **Неуспешные платежи Stripe (involuntary churn)** — founders SaaS · ежемесячно · Smart Retries · нет branded emails/UI · **да** ($50–500+/mo tools)
2. **Непонятные decline codes** — founders · при каждом fail · CSV из Dashboard · ручная каша · да
3. **Нет dunning-последовательности** — indie · постоянно · ничего / Resend руками · теряют MRR · да
4. **Cancel flow без save offers** — mid SaaS · при churn · кастом · Churnkey дорогой · да ($200+)
5. **Usage/credits ledger** — AI SaaS · ежедневно · самопис / Stripe metered · metered не умеет reserve · да (дорого)
6. **Сведение usage в Stripe** — billing ops · раз в месяц · Excel · ошибки споров · да/ищут free tools
7. **Proration edge cases** — SaaS · при апгрейдах · руками · баги · да
8. **Мульти-валюта / налоги** — EU SaaS · постоянно · Stripe Tax · сложно · да
9. **Failed webhook → lost recovery** — eng · при пиках · sync handler · дропы · косвенно
10. **Past_due без banner в продукте** — product · постоянно · забывают · silent churn · да
11. **Chargeback после retries** — finance · эпизодически · слепо retry · штрафы · да
12. **Нет grace period после cancel** — CS · еженедельно · руками · злость клиентов · да
13. **Revenue recognition для usage** — finance · месяц · sheets · ошибки · да
14. **Trial → paid conversion tracking** — growth · постоянно · кустарно · слепота · да
15. **Seat-based vs usage hybrid billing** — B2B · при продаже · костыли · да (Lago etc.)

### B. Агентства / маркетинг (16–35)

16. **Клиентские отчёты занимают больше времени, чем кампании** — media buyers · каждый месяц · Sheets+GA4+Meta · 4+ часа/клиент · **да** ($42–239)
17. **Клиенты не читают дашборды** — AM · еженедельно · WhatsApp-саммари · ручная писанина · да
18. **«Что делать дальше?» нет в отчёте** — клиенты агентств · всегда · звонки · трата времени · платят агентству
19. **White-label reporting дорого** — small agencies · постоянно · DashThis/AgencyAnalytics · маржа ест · да
20. **Rank tracker слишком дорогой** — SEO agencies · месяц · AccuRanker $200+ · ищут дешевле · да
21. **Ahrefs не трекает page 2+** — SEO · 2025+ · workaround · дыра · да
22. **Local Map Pack tracking** — local SEO · еженедельно · Local Falcon · отдельный tool · да
23. **Сбор отзывов для локальных клиентов** — local SEO · постоянно · Grade.us seats · дорого · да
24. **White-label отзывов: per-seat боль** — agencies · рост · Grade.us · margin kill · да (EmbedMyReviews и др.)
25. **Pinterest-трафик руками** — bloggers · еженедельно · ручные пины · BlogToPin доказал спрос · **да** ($39–179)
26. **Кросспостинг в 6+ соцсетей** — creators · ежедневно · Buffer $75–200 · overkill · да (Post Bridge)
27. **Substack Notes consistency** — writers · ежедневно · руками · WriteStack · да
28. **LinkedIn carousel из статьи** — B2B · еженедельно · Canva руками · медленно · частично
29. **Контент-пайплайн ломается** — ops · часто · Zapier/n8n · brittle · да
30. **Клиент «гонится» за апдейтами** — agencies · постоянно · email · потеря retainer · да
31. **Скрытые fees агентств** — клиенты · сделки · trust break · — · косвенно
32. **SEO-отчёт без narrative** — agencies · месяц · шаблоны · «одинаково каждую неделю» · да
33. **Репутация на Google vs Yandex vs 2GIS** — RU local · ежедневно · 5 кабинетов · хаос · да (MyReviews, Рэйти…)
34. **Негатив уходит в карты раньше, чем узнают** — клиники · критично · вручную · да
35. **QR/ссылка на отзыв после визита** — салоны/клиники · каждый клиент · забывают · да

### C. Фрилансеры / студии (36–50)

36. **Поздние оплаты** — freelancers · постоянно · chase email · стресс · да ($19 tools) / Zoho free
37. **Потеря billable hours** — hourly · ежедневно · Toggl/Harvest · забывают стартовать · да
38. **Proposal → contract → invoice разрознены** — freelancers · на сделку · HoneyBook/Bonsai · дорого/ограничения · да
39. **HoneyBook emails в spam** — creatives · часто · жалобы Reddit · да (switch)
40. **Нет Stripe в HoneyBook** — freelancers · всегда · lock-in · да
41. **Клиентский портал слишком тяжёлый** — solo · — · all-in-one · overpay · да за узкий portal
42. **Scope creep без трекинга** — consultants · проекты · sheets · спор · да
43. **Договоры/акты для самозанятых (RU)** — agencies · каждую выплату · руками/1С · боль · да (PF ERP и др.)
44. **Оценка задач «на глаз»** — freelancers · каждый бриф · — · демпинг · частично
45. **Upwork RSS убрали — нет алертов** — freelancers · ежедневно · polling · HN боль · да за alerts
46. **КП делается 2–4 часа** — designers · сделка · Canva/Notion · медленно · да
47. **Файлы одобрения в email-хаосе** — studios · проект · Drive+email · потеря версий · да
48. **Retainer invoicing** — agencies · месяц · Bonsai etc · ок, но fragmented · да
49. **Налоги/расходы фрилансера** — solo · квартал · Wave/QB · friction · да
50. **Переключение 5 инструментов** — solo · день · — · «wish one tool» · да, но saturated

### D. E-commerce / маркетплейсы (51–70)

51. **Inventory drift Shopify↔Amazon** — sellers · flash sales · sync apps · oversell · да (дорого)
52. **Cin7 слишком дорогой** — mid sellers · — · spreadsheet · ошибки · да за lighter tool
53. **Returns не возвращаются на склад** — ops · постоянно · руками · мёртвый сток · да
54. **Репрайсинг** — WB/Ozon · ежедневно · MPSTATS modules · дорого · да
55. **Автоответы на отзывы WB** — sellers · ежедневно · менеджер 500₽/час · **да**, но ниша забита (Эра, AAWB, SellAir, Отвечумба…)
56. **Юнит-экономика SKU** — sellers · неделя · Excel · ошибки · да
57. **SEO карточки** — sellers · постоянно · генераторы в suites · качество спорно · да
58. **Биддер рекламы нестабилен** — sellers · день · MPSTATS · жалобы на сбои · да
59. **Мульти-площадки в одном окне** — sellers · день · Moneyplace дорого · да
60. **Неточные данные внешней аналитики** — sellers · всегда · ожидание ≠ модель · churn
61. **Flash sale sync 15 мин = катастрофа** — multichannel · события · polling · да за event-driven
62. **Safety stock buffer** — ops · high volume · руками · упущенные продажи · да
63. **Отзывы убивают ранжирование** — sellers · критично · медленные ответы · да
64. **Поставки/FBO остатки** — RU sellers · неделя · кабинет · да
65. **Конкурентный мониторинг цен** — sellers · день · tools · да
66. **Фото/инфографика карточек** — content · запуск · дизайнеры · да за AI editors
67. **Возвраты маркетплейсов** — finance · месяц · 1С · боль · да
68. **Рекламный ROI по SKU** — growth · неделя · сведение · да
69. **Дубли SKU / вариации** — catalog · рост · хаос · да
70. **Блокировки кабинетов** — sellers · риск · нет early warning · частично

### E. DevTools / infra (71–90)

71. **Сайт «жив», но UI сломан** — agencies/saas · редко но дорого · uptime only · **да** за visual monitor
72. **SSL истекает незаметно** — ops · раз в год · calendar · outage · да
73. **Domain WHOIS expiry** — agencies · клиенты · вручную · катастрофа · да
74. **Cron job silent fail** — eng · — · healthchecks · fragmented stack · да (Fivenines)
75. **Status page Atlassian дорогой** — SaaS · — · Statuspage · ищут дешевле · да
76. **Screenshot API дорого** — builders · product · Urlbox/ScreenshotOne · commodity race · слабо
77. **OG images** — marketers · каждый пост · Figma · Vercel OG / ShotOG · слабо
78. **Secrets: Doppler $21/seat для соло** — solo · — · .env plaintext · AI agents читают · да за local vault (tene free → monetization hard)
79. **dotenv-vault Pro умер** — teams · 2026 · миграция · да
80. **Visual regression Percy $399** — small teams · CI · skip · да за дешёвый API+diff
81. **Preview URL visual check для AI agents** — AI coding · PR · SnapDiff niche · emerging
82. **Broken links в docs** — docs · месяц · crawlers · да
83. **Changelog писать вручную** — PMs · релиз · Beamer MAU pricing · да за flat $29
84. **Canny tracked users дорожает** — product · рост · Featurebase/Frill · да
85. **Feature requests в 10 каналах** — product · всегда · вручную · да
86. **VS Code: нет native paid** — extension authors · — · Gumroad license · friction · да (code-checkout)
87. **Локальный LLM в IDE** — privacy-devs · день · Ollama DIY · да (Sweep/DevoxxGenie)
88. **Supabase SQL validate before run** — supabase users · день · runtime errors · да (пример выручки)
89. **JSON transform локально** — privacy · — · cloud LLM · да
90. **JetBrains AI gap vs Cursor** — JB users · день · plugins · да

### F. Операционка / прочее (91–110)

91. **Форматирование Google Sheets** — Sheets power users · день · руками · HN · да за formatting engine
92. **Организация Downloads/скриншотов** — knowledge workers · день · вручную · локальные AI tools · слабо платят
93. **Синтез из docs+threads в решение** — analysts · неделя · LLM summaries · human merge · слабо SaaS
94. **Travel planning chaos** — consumers · редко · — · не B2B
95. **Галерея фото** — consumers · — · — · слабо
96. **Testimonial collection** — marketers · launch · Senja/Testimonial.to · crowded · да но saturated
97. **Wall of Love widget** — SaaS · site · free tiers · branding paywall · да
98. **Waitlist / referral** — launches · — · many tools · saturated
99. **Transactional email deliverability** — SaaS · всегда · Resend/Postmark · ok market
100. **Form spam** — sites · день · Turnstile · commodity
101. **Cookie consent EU** — sites · launch · many CMPs · saturated
102. **Accessibility monitoring** — compliance · — · axe tools · mid
103. **Appointment no-shows** — clinics · день · SMS reminders · да
104. **Link-in-bio analytics** — creators · — · many · saturated
105. **PDF invoice EU VAT** — freelancers · месяц · accounting · mid
106. **Knowledge base vs Intercom дорого** — SaaS · — · Featurebase help · да
107. **Onboarding checklists HR SMB** — SMB · hire · Notion · mid
108. **Отпуска/отгулы SMB RU** — HR · — · 1С heavy · mid
109. **Агрегатор заявок (TG+WA+forms)** — agencies RU · день · руками · да
110. **Программный SEO agent** — founders · — · SEOBOT ~$80k MRR claimed · crowded/hot

---

## Этап 3. Фильтр возможностей

### Прошли фильтр «соло / 2–8 недель / подписка / низкая поддержка»

| ID | Идея | Почему прошла | Риск |
|---|---|---|---|
| A | Niche paid IDE extension | Marketplace distribution, low support | Потолок MRR |
| B | Agency report narrator (GA4→PDF+текст) | Боль доказана, цена $49–99 | Интеграции, конкуренты |
| C | One-channel deep automation (BlogToPin-паттерн) | Доказанная модель денег | Нужен свободный канал |
| D | Client site health для веб-агентств (SSL+domain+uptime+links) | Чёткая катастрофа-боль | Commodity monitoring |
| E | Stripe decline-aware dunning <$20 | ROI ясен | SubRevival/RetryKit/Stripe free |

### Исключены жёстко (по вашим правилам + Critic)

- AI Chat / ChatGPT clone / image gen / AI PDF / todo / CRM / generic SaaS
- WB автоответы — **рынок забит** (Эра, AAWB, SellAir, Отвечумба, MP Manager…)
- RU отзывы клиник — **забит** (MyReviews, Рэйти, Proofwall, Say Say, Забота…)
- Social schedulers — Post Bridge/Buffer/PostFast
- Testimonials — Senja ecosystem
- Feedback boards — Featurebase/Canny/Frill
- Screenshot/OG API — race to bottom + infra
- Rank trackers — scraping cost + AccuRanker/Nightwatch
- GEO AI visibility — дорого, команды, перегрев

---

## Этап 4. Конкуренты (по выжившим)

### A. Niche IDE extensions

| Название | Цена | Пользователи | Плюсы | Минусы | Слабость |
|---|---|---|---|---|---|
| GitLens+ | $5–25/mo | millions free | бренд, глубина | компания, не соло-ниша | — |
| Database Client Pro | ~$39–99 LT | high | DB UX | широкий scope | — |
| Sweep (JB) | $10–60/mo | ~67k installs | AI in JB | stalled releases 2026 | continuity |
| DevoxxGenie | freemium | 75k dl | local-first | open competition | — |
| Indie niche (пример SupaQuery) | $5/mo | ~920 paid claimed | узкая боль | unverified anecdotes | discovery |

**Окно:** не «ещё AI autocomplete», а **узкий workflow в конкретной экосистеме** (Supabase, Prisma, Cloudflare Workers, Temporal…) + local/privacy.

### B. Agency reporting

| Название | Цена | Плюсы | Минусы | Слабость |
|---|---|---|---|---|
| DashThis | $42–209 | дёшево на старте | мало SEO depth | нет narrative |
| AgencyAnalytics | $79–239+ | SEO suite | дорого small | narrative слабо |
| Whatagraph/Swydo | mid | connectors | цена/сложность | — |
| Looker Studio | free | гибко | ручная сборка | время |
| AI narrative startups | varies | текст | качество «AI slop» | trust |

**Окно:** не дашборд, а **«2 абзаца + 3 вывода + next steps»** из GA4/Ads за минуты. Дашборды уже есть; письмо клиенту — нет.

### C. One-channel automation

| Название | Цена | MRR signal | Слабость |
|---|---|---|---|
| BlogToPin | $39–179 | ~$15k | churn 10–15% |
| WriteStack | sub | ~$9k | Substack-only |
| Post Bridge | mid | ~$18k | multi, crowded entry |

**Окно:** только если найти канал **без** сильного BlogToPin-аналога. Иначе не входить.

### D. Monitoring for agencies

| Название | Цена | Плюсы | Минусы |
|---|---|---|---|
| UptimeRobot | $0–7+ | просто | limited free, weak agency UX |
| Better Stack | $24+ | powerful | overkill |
| Fivenines | €9 | all-in | общий рынок |
| Visualping | $80–100 | visual | дорого |
| StayAlive-like | indie | niche | мало бренда |

**Окно:** white-label PDF «здоровье сайта клиента» раз в неделю для агентств 10–50 сайтов.

### E. Dunning

| Название | Цена | Для кого |
|---|---|---|
| Stripe Smart Retries | free | <$30k MRR |
| SubRevival | ~$19 | indies |
| RetryKit | % recovered | indies |
| Churnkey | $200+ | mid-market |
| Baremetrics Recover | $58+ | Baremetrics users |
| ProfitWell/Paddle Retain | % / suite | Paddle |

**Окно:** почти закрыто. Critic: **убить**.

---

## Этап 5. Деньги (без оптимизма)

Шкала вероятностей — субъективная оценка команды после исследования, не прогноз.

| Идея | P($100) | P($1k) | P($10k MRR) | Время до MVP | Поддержка | Тяжесть продаж |
|---|---|---|---|---|---|---|
| A Niche IDE ext | **55%** | **35%** | **8%** | 2–4 нед | низкая | средняя (SEO+marketplace) |
| B Report narrator | **40%** | **25%** | **12%** | 4–8 нед | средняя+ | высокая (outbound agencies) |
| C One-channel auto | **30%** | **20%** | **15%** | 4–8 нед | средняя | средняя (creators) |
| D Agency site health | **35%** | **18%** | **6%** | 3–6 нед | низкая–средняя | высокая |
| E Dunning <$20 | **25%** | **10%** | **3%** | 2–3 нед | низкая | высокая (crowded) |

**Комментарий Founder:** $10k MRR ≈ 100–200 клиентов по $50–100. Для IDE — нужно очень много installs. Для agency report — достаточно ~100 агентств, но продавать тяжело.

---

## Этап 6. Критика — попытка уничтожить

### A. Niche IDE extension
- **Почему не взлетит:** 1–3% conversion; Microsoft не помогает monetize; «ещё одно расширение».
- **Риски:** VS Code API churn; бесплатные OSS аналоги.
- **Кто убьёт:** GitHub Copilot / Cursor встроили фичу; экосистема сделала native tool.
- **Почему не платят:** «хватит free tier».
- **Вердикт Critic:** не убита полностью. Лучший P($100). Слабый P($10k).

### B. Agency report narrator
- **Почему не взлетит:** агентства уже на Looker+ChatGPT; «AI slop» в отчётах = churn; OAuth-ад.
- **Риски:** Google API limits; Meta ToS; поддержка коннекторов сожрёт соло.
- **Кто убьёт:** AgencyAnalytics добавит AI narrative; Notion AI templates.
- **Почему не платят:** «у нас джун пишет за $300/мес».
- **Вердикт Critic:** почти убита, если делать >2 коннектора. Жива **только** как GA4(+Ads) → narrative PDF.

### C. One-channel automation
- **Почему не взлетит:** канал уже занят; platform API ban; churn как у BlogToPin 10–15%.
- **Риски:** ToS Pinterest/LinkedIn/Meta.
- **Кто убьёт:** платформа native scheduling; Buffer.
- **Вердикт Critic:** убита **без** найденного пустого канала. Не стартовать «наугад».

### D. Agency site health
- **Почему не взлетит:** UptimeRobot «достаточно»; агентства не платят за профилактику.
- **Риски:** false positives; infra cost screenshots.
- **Вердикт Critic:** слабая. Убить как primary.

### E. Dunning
- **Вердикт Critic:** **убить.** Stripe free + SubRevival закрыли окно для нового соло.

### Дополнительно убито исследованием
WB replies, RU clinic reviews, social schedulers, testimonials, Canny-clones, screenshot APIs, GEO (для соло), rank trackers.

---

## Этап 7. Победитель

### Честный ответ

**Выдающегося победителя нет.** Выбирать «лучшую из плохих» и писать production-код — это как раз то, от чего вы просили уберечь.

### Что делать вместо самообмана

Есть **два рациональных пути** с разной математикой:

| Путь | Цель | Почему |
|---|---|---|
| **Путь 1 — вероятность первых денег** | Niche paid extension (VS Code или JetBrains) под **вашу** ежедневную боль в стеке | Самый высокий P($100–$1k), встроенный дистрибутив, мало поддержки |
| **Путь 2 — вероятность масштаба** | GA4→клиентский narrative-отчёт для digital-агентств (1–2 коннектора) | Выше P($10k), но тяжелее продажи и выше риск «AI slop» |

**Рекомендация команды:** не писать код.  
Сначала **3–7 дней валидации Пути 2** (деньги крупнее) + параллельно список ниш для Пути 1 из вашего стека.  
Если Путь 2 не набирает критерии — немедленно переключиться на Путь 1.

Ниже валидация заточена под **Путь 2 как primary candidate** (не как «победитель рынка», а как лучший bet на проверку).

**Название кандидата:** **ReportBrief** — «Клиентский отчёт агентства за 5 минут: цифры + выводы, без дашборд-цирка».

---

## Этап 8. Проверка спроса (до кода)

### Можно ли проверить за несколько дней?

**Да.** Покупатель идентифицируем (владельцы digital-агентств 3–20 клиентов). Канал — LinkedIn / Telegram / Reddit r/agency / холодные письма. Лендинг + 30 outreach + 10 интервью достаточно.

### Оффер

> Вы тратите 3–6 часов на ежемесячный отчёт клиенту.  
> ReportBrief подключается к GA4 (и Google Ads), собирает период, и выдаёт **короткий клиентский PDF**: что произошло, почему, что делать дальше — в вашем tone of voice.  
> **$49/mo за 5 клиентов · $99/mo за 15.**  
> Не дашборд. Текст, который клиент реально читает.

### Лендинг

См. `/validation/index.html` в этом репозитории.

### Холодные сообщения (шаблоны)

**LinkedIn / email:**

```
Привет, {Name}. Вижу, у {Agency} {N} retainer-клиентов.

Вопрос на 20 секунд: сколько часов в месяц уходит на клиентские отчёты
(не на работу, а именно на сбор GA4/Ads + текст «что это значит»)?

Спрашиваю, потому что собираю waitlist на узкий инструмент:
GA4 → готовый клиентский PDF с выводами (без ещё одного дашборда).

Если боль знакома — ответьте цифрой часов. Если нет — скажите «не болит».
```

**Reddit / форум (не спам-пиар):**

```
Agency owners: how many hours/month do you burn on client reporting
(data pull + writing the narrative)? Looking for real numbers, not tool pitches.
```

### Поиск первых пользователей

1. 50 профилей: «digital agency founder», «performance marketing agency», «SEO agency owner».
2. 30 персональных сообщений за 2 дня.
3. 5 постов в нишевых чатах (ценность: шаблон отчёта бесплатно → waitlist).
4. 10 созвонов по 20 минут.

### Сценарий интервью (20 мин)

1. Сколько retainer-клиентов? Средний чек?
2. Как сейчас делаете monthly report? Инструменты?
3. Сколько часов на 1 клиента? Кто пишет текст?
4. Что клиент читает / игнорирует?
5. Платите ли уже за DashThis/AgencyAnalytics/Whatagraph? Сколько?
6. Если GA4→PDF с выводами за $49/mo на 5 клиентов — купили бы на этой неделе? Почему нет?
7. Что должно быть в первой версии, иначе бесполезно?

### Критерии успешной проверки (жёсткие)

| Сигнал | Pass | Fail |
|---|---|---|
| Ответы на outreach | ≥15/50 (30%) содержательных | <10% |
| «Это боль, часы ≥3/client» | ≥8 человек | <5 |
| Готовность к paid pilot | ≥5 говорят «возьму за $49 если сработает» | «интересно, напиши» без денег |
| Prepay / card intent | ≥3 кладут карту на waitlist **или** ≥2 платят deposit $49 | 0 |
| Конкурент уже закрыл | «у нас AI в AgencyAnalytics хватает» ≥50% | — |

**Если Fail — не строить ReportBrief.** Перейти к Пути 1 (IDE extension по вашей боли) или искать one-channel gap.

### Почему не кодить сейчас

Потому что P($10k) у ReportBrief ~12% **до** валидации, и падает до ~3%, если интервью покажут ChatGPT+Sheets «достаточно». Код не лечит отсутствие willingness to pay.
