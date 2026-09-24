/**
 * Domain model — implements the UML class diagram of the project.
 *
 *   Evento      -> Event    (getResumo()      -> getSummary())
 *   Palestrante -> Speaker  (exibirCard()     -> renderCard())
 *   Atividade   -> Activity (exibirNaAgenda() -> renderScheduleItem())
 *
 * An Event "has" many Speakers and "is composed of" many Activities.
 * Identifiers are in English; user-facing values are in Portuguese.
 */

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const getInitials = (name) =>
  name
    .replace(/^((Prof|Dra?)\.\s*)+/, '')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('');

export const ACTIVITY_TYPES = {
  talk: 'Palestra',
  workshop: 'Oficina',
  networking: 'Networking',
};

export class Speaker {
  constructor({ id, name, role, organization, topic, bio, photo = null }) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.organization = organization;
    this.topic = topic;
    this.bio = bio;
    this.photo = photo;
  }

  renderCard() {
    const media = this.photo
      ? `<img class="speaker-card__photo" src="${escapeHtml(this.photo)}" alt="Retrato ilustrado de ${escapeHtml(this.name)}" width="480" height="360" loading="lazy">`
      : `<div class="speaker-card__photo speaker-card__photo--initials" aria-hidden="true">${escapeHtml(getInitials(this.name))}</div>`;

    return `
      <article class="speaker-card">
        ${media}
        <div class="speaker-card__body">
          <span class="badge speaker-card__topic">${escapeHtml(this.topic)}</span>
          <h3 class="speaker-card__name">${escapeHtml(this.name)}</h3>
          <p class="speaker-card__role">${escapeHtml(this.role)} · ${escapeHtml(this.organization)}</p>
          <p class="speaker-card__bio">${escapeHtml(this.bio)}</p>
        </div>
      </article>`;
  }
}

export class Activity {
  constructor({ title, date, time, room, type, speaker = null }) {
    this.title = title;
    this.date = date;
    this.time = time;
    this.room = room;
    this.type = type;
    this.speaker = speaker;
  }

  get typeLabel() {
    return ACTIVITY_TYPES[this.type];
  }

  renderScheduleItem() {
    const speaker = this.speaker
      ? `<span>${escapeHtml(this.speaker.name)}</span>`
      : '';

    return `
      <li class="timeline__item timeline__item--${this.type}">
        <time class="timeline__time" datetime="${this.date}T${this.time}">${this.time}</time>
        <div class="timeline__content">
          <span class="badge badge--${this.type}">${this.typeLabel}</span>
          <h3 class="timeline__title">${escapeHtml(this.title)}</h3>
          <p class="timeline__meta">
            ${speaker}
            <span>${escapeHtml(this.room)}</span>
          </p>
        </div>
      </li>`;
  }
}

export class Event {
  constructor({ name, edition, startDate, endDate, description, location, speakers = [], activities = [] }) {
    this.name = name;
    this.edition = edition;
    this.startDate = startDate;
    this.endDate = endDate;
    this.description = description;
    this.location = location;
    this.speakers = speakers;
    this.activities = activities;
  }

  get days() {
    return [...new Set(this.activities.map((activity) => activity.date))].sort();
  }

  getActivitiesByDay(date) {
    return this.activities
      .filter((activity) => activity.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  countActivities(type) {
    return this.activities.filter((activity) => activity.type === type).length;
  }

  getSummary() {
    const period = `${formatDay(this.startDate)} a ${formatDate(this.endDate)}`;

    return `
      <p>A <strong>${escapeHtml(this.name)} ${this.edition}</strong> acontece de <strong>${period}</strong>, no ${escapeHtml(this.location)}.</p>
      <p>${escapeHtml(this.description)}</p>`;
  }
}

/* Date helpers ------------------------------------------------------------ */

const toDate = (isoDate) => new Date(`${isoDate}T12:00:00`);

export const formatDay = (isoDate) =>
  toDate(isoDate).toLocaleDateString('pt-BR', { day: 'numeric' });

export const formatDate = (isoDate) =>
  toDate(isoDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatShortDate = (isoDate) =>
  toDate(isoDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

export const formatWeekday = (isoDate) => {
  const weekday = toDate(isoDate).toLocaleDateString('pt-BR', { weekday: 'long' });
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
};

/* Event data -------------------------------------------------------------- */

const speakers = {
  helena: new Speaker({
    id: 'helena',
    name: 'Dra. Helena Duarte',
    role: 'Pesquisadora em Inteligência Artificial',
    organization: 'Lumen Labs',
    topic: 'Inteligência Artificial',
    bio: 'Doutora em Ciência da Computação, lidera projetos de IA aplicada à saúde e ao agronegócio no sul do país.',
  }),
  rafael: new Speaker({
    id: 'rafael',
    name: 'Rafael Tavares',
    role: 'Engenheiro de Plataforma',
    organization: 'Nuvra Cloud',
    topic: 'DevOps e Cloud',
    bio: 'Egresso da UCPel, há dez anos automatiza infraestrutura e ajuda equipes a entregar software com mais frequência e segurança.',
  }),
  marina: new Speaker({
    id: 'marina',
    name: 'Marina Kowalski',
    role: 'Head de UX',
    organization: 'Bússola Digital',
    topic: 'UX Design',
    bio: 'Especialista em pesquisa com usuários e design de serviços, já conduziu projetos para bancos, varejo e governo.',
  }),
  lucas: new Speaker({
    id: 'lucas',
    name: 'Prof. Dr. Lucas Brandão',
    role: 'Professor e pesquisador',
    organization: 'Instituto Sul de Tecnologia',
    topic: 'Segurança da Informação',
    bio: 'Coordena o laboratório de segurança ofensiva do instituto e atua como consultor em resposta a incidentes.',
  }),
  camila: new Speaker({
    id: 'camila',
    name: 'Camila Nogueira',
    role: 'Cientista de Dados',
    organization: 'Pampa Analytics',
    topic: 'Ciência de Dados',
    bio: 'Transforma dados em decisões para empresas do agronegócio gaúcho e é mentora de mulheres na tecnologia.',
  }),
  thiago: new Speaker({
    id: 'thiago',
    name: 'Thiago Ferraz',
    role: 'Desenvolvedor Mobile Sênior',
    organization: 'Farol Apps',
    topic: 'Desenvolvimento Mobile',
    bio: 'Desenvolve aplicativos usados por milhões de pessoas e contribui com projetos de código aberto em Flutter.',
  }),
};

const AUDITORIUM = 'Auditório Dom Antônio Zattera';
const HALL = 'Hall do Campus I';
const LAB_3 = 'Laboratório de Informática 3';
const LAB_5 = 'Laboratório de Informática 5';

const activities = [
  // Day 1
  new Activity({ date: '2026-10-20', time: '08:30', type: 'networking', room: HALL, title: 'Credenciamento e café de boas-vindas' }),
  new Activity({ date: '2026-10-20', time: '09:30', type: 'talk', room: AUDITORIUM, speaker: speakers.helena, title: 'Palestra de abertura: IA aplicada ao dia a dia das empresas' }),
  new Activity({ date: '2026-10-20', time: '14:00', type: 'workshop', room: LAB_3, speaker: speakers.rafael, title: 'Oficina: primeiros passos com Docker' }),
  new Activity({ date: '2026-10-20', time: '16:30', type: 'talk', room: AUDITORIUM, speaker: speakers.rafael, title: 'Da ideia ao deploy: cultura DevOps na prática' }),
  new Activity({ date: '2026-10-20', time: '19:00', type: 'talk', room: AUDITORIUM, speaker: speakers.marina, title: 'Design centrado nas pessoas: como a pesquisa muda produtos' }),
  // Day 2
  new Activity({ date: '2026-10-21', time: '09:00', type: 'talk', room: AUDITORIUM, speaker: speakers.lucas, title: 'Segurança da informação: o que todo desenvolvedor precisa saber' }),
  new Activity({ date: '2026-10-21', time: '10:30', type: 'workshop', room: LAB_5, speaker: speakers.marina, title: 'Oficina: prototipação rápida no Figma' }),
  new Activity({ date: '2026-10-21', time: '14:00', type: 'workshop', room: LAB_3, speaker: speakers.camila, title: 'Oficina: análise de dados com Python' }),
  new Activity({ date: '2026-10-21', time: '16:30', type: 'talk', room: AUDITORIUM, speaker: speakers.camila, title: 'Dados como ativo estratégico no agronegócio' }),
  new Activity({ date: '2026-10-21', time: '18:30', type: 'networking', room: AUDITORIUM, title: 'Roda de conversa com egressos da UCPel' }),
  // Day 3
  new Activity({ date: '2026-10-22', time: '09:00', type: 'talk', room: AUDITORIUM, speaker: speakers.thiago, title: 'Aplicativos multiplataforma: escolhas que fazem diferença' }),
  new Activity({ date: '2026-10-22', time: '10:30', type: 'workshop', room: LAB_5, speaker: speakers.thiago, title: 'Oficina: seu primeiro app com Flutter' }),
  new Activity({ date: '2026-10-22', time: '14:00', type: 'networking', room: HALL, title: 'Feira de estágios e carreiras em tecnologia' }),
  new Activity({ date: '2026-10-22', time: '17:00', type: 'networking', room: AUDITORIUM, title: 'Painel de encerramento e entrega de certificados' }),
];

export const event = new Event({
  name: 'Semana Tecnológica UCPel',
  edition: 2026,
  startDate: '2026-10-20',
  endDate: '2026-10-22',
  location: 'Campus I da UCPel, em Pelotas (RS)',
  description:
    'O evento reúne estudantes, egressos, docentes e profissionais do mercado em palestras, oficinas práticas nos laboratórios da universidade e atividades de networking. É uma oportunidade de conhecer as tendências da área, aprender ferramentas usadas no mercado e se aproximar de empresas da região.',
  speakers: Object.values(speakers),
  activities,
});
