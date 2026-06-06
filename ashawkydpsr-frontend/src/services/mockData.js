// src/services/mockData.js
// In‑memory mock – resets on refresh. Replace with real API later.

let dailyEntries = [];
let activities = [];
let progressItems = [];
let settings = {
  engineerEditWindow: 24,
  monthlyReportCycle: 'Calendar Month',
  allowPlannersEdit: true,
  workCalendar: ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday'],
  licenseExpiry: '2026-07-01',
  users: [
    { id: 1, username: 'admin', role: 'admin', password: 'admin123' },
    { id: 2, username: 'planner1', role: 'planner', password: 'planner123' },
    { id: 3, username: 'engineer1', role: 'engineer', password: 'eng123' }
  ]
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Daily entries
export const fetchDailyEntries = async () => { await delay(100); return [...dailyEntries]; };
export const saveDailyEntry = async (entry) => {
  await delay(100);
  const newEntry = { ...entry, id: Date.now() };
  dailyEntries = [newEntry, ...dailyEntries];
  return newEntry;
};
export const deleteDailyEntry = async (id) => {
  await delay(100);
  dailyEntries = dailyEntries.filter(e => e.id !== id);
};

// Activities
export const fetchActivities = async () => { await delay(100); return [...activities]; };
export const saveActivity = async (act) => {
  await delay(100);
  const newAct = { ...act, id: Date.now() };
  activities.push(newAct);
  return newAct;
};
export const deleteActivity = async (id) => {
  await delay(100);
  activities = activities.filter(a => a.id !== id);
};

// Progress
export const fetchProgress = async () => { await delay(100); return [...progressItems]; };
export const saveProgressItem = async (item) => {
  await delay(100);
  const newItem = { ...item, id: Date.now() };
  progressItems.push(newItem);
  return newItem;
};
export const updateProgressItem = async (id, updates) => {
  await delay(100);
  const index = progressItems.findIndex(p => p.id === id);
  if (index !== -1) progressItems[index] = { ...progressItems[index], ...updates };
  return progressItems[index];
};
export const deleteProgressItem = async (id) => {
  await delay(100);
  progressItems = progressItems.filter(p => p.id !== id);
};

// Settings
export const fetchSettings = async () => { await delay(100); return { ...settings }; };
export const saveSettings = async (newSettings) => {
  await delay(100);
  settings = { ...settings, ...newSettings };
  return settings;
};

// Auth & License
export const login = async (username, password) => {
  await delay(300);
  const user = settings.users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
export const checkLicense = async () => {
  await delay(50);
  const expiry = settings.licenseExpiry;
  const isValid = new Date(expiry) > new Date();
  return { valid: isValid, expiry };
};
