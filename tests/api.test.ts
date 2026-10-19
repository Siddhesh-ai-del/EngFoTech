// @vitest-environment node
import {beforeAll, describe, expect, it} from 'vitest';
import request from 'supertest';
import type {Express} from 'express';
import {createApp} from '../server';

let app: Express;

beforeAll(async () => {
  app = await createApp();
});

describe('POST /api/auth/register', () => {
  it('creates a user with a valid email and password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({email: 'arman@example.com', password: 'supersecret1', name: 'Arman'});

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({email: 'arman@example.com', name: 'Arman'});
    expect(res.body.user.id).toBeDefined();
  });

  it('derives a name from the email when no name is given', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({email: 'kestudent@example.com', password: 'supersecret1'});

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('kestudent');
  });

  it('rejects a duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({email: 'arman@example.com', password: 'supersecret1'});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email already exists');
  });

  it('rejects a malformed email with 400, not 500', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({email: 'not-an-email', password: 'supersecret1'});

    expect(res.status).toBe(400);
  });

  it('rejects a missing email with 400, not 500', async () => {
    const res = await request(app).post('/api/auth/register').send({password: 'supersecret1'});

    expect(res.status).toBe(400);
  });

  it('rejects a password shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({email: 'short@example.com', password: 'abc'});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/at least 8 characters/);
  });
});

describe('POST /api/auth/login', () => {
  it('returns the user for correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({email: 'arman@example.com', password: 'supersecret1'});

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({email: 'arman@example.com'});
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('returns 401 for a wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({email: 'arman@example.com', password: 'wrong-password'});

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('returns 401 for an unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({email: 'nobody@example.com', password: 'supersecret1'});

    expect(res.status).toBe(401);
  });

  it('rejects a body with no credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
  });
});

describe('profile and roadmap round trip', () => {
  const profile = {
    university: 'University of Mumbai',
    college: 'VJTI',
    branch: 'Computer Engineering',
    year: '3rd',
    cgpa: '8.5',
    tier: 'Tier 1',
    skills: {languages: ['TypeScript'], tools: ['Git'], certifications: [], projects: []},
    interests: ['IT / Software'],
    constraints: {
      financialPressure: false,
      immediateJob: true,
      relocation: true,
      higherStudiesBudget: 'Low',
    },
  };

  it('saves and reads back a profile with JSON columns parsed', async () => {
    const user = (
      await request(app)
        .post('/api/auth/register')
        .send({email: 'profile@example.com', password: 'supersecret1'})
    ).body.user;

    const save = await request(app).post('/api/profile').send({userId: user.id, ...profile});
    expect(save.status).toBe(200);
    expect(save.body).toEqual({success: true});

    const fetched = await request(app).get(`/api/profile/${user.id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.university).toBe('University of Mumbai');
    expect(fetched.body.skills).toEqual(profile.skills);
    expect(fetched.body.interests).toEqual(['IT / Software']);
  });

  it('returns 404 for an unknown profile', async () => {
    const res = await request(app).get('/api/profile/999999');
    expect(res.status).toBe(404);
  });

  it('refuses to save a profile for a user that does not exist', async () => {
    const res = await request(app).post('/api/profile').send({userId: 999999, ...profile});

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/log in again/i);
  });

  it('saves and reads back the latest roadmap', async () => {
    const user = (
      await request(app)
        .post('/api/auth/register')
        .send({email: 'roadmap@example.com', password: 'supersecret1'})
    ).body.user;

    const content = {targetJobs: ['Frontend Engineer'], roadmap: []};

    const save = await request(app).post('/api/roadmap').send({userId: user.id, content});
    expect(save.status).toBe(200);

    const fetched = await request(app).get(`/api/roadmap/${user.id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body).toEqual(content);
  });

  it('returns null for a user with no roadmap', async () => {
    const res = await request(app).get('/api/roadmap/999999');
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });
});
