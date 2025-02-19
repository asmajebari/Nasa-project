const request = require('supertest');
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planets.model');
const {
    mongoConnect,
    mongoDisconnect,
  } = require('../../services/mongo');


describe('Launches API', () => {
    //setup:
    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });
    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200);
            //expect(response.statusCode).toBe(200);
        });
    });

    describe('Test POST /launch', () => {
        const completeLaunchData = {
            mission: 'USS Entreprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2025'
        };
    
        const LaunchDataWithoutDate = {
            mission: 'USS Entreprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f'
        };
    
        const LaunchDataWithInvalidDate = {
            mission: 'USS Entreprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate:'hello'
        };
            
        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
            //whenever we test the body, we use jest
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            
            expect(responseDate).toBe(requestDate);
                
            expect(response.body).toMatchObject(LaunchDataWithoutDate);
        });
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(LaunchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            });
    
        });
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(LaunchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(response.body).toStrictEqual({
                error: 'Invalid launch date',
            });
        });
    });
    afterAll(async () => {
        await mongoDisconnect();
    })
});
