import { describe, expect, it } from 'bun:test';
import app from './basic-api';
import { env } from 'bun';

const { USER_NAME, USER_EMAIL, USER_ID } = env


describe('API Tests', () => {
    it('Should return 200 Response for root endpoint', async () => {
        const req = new Request('http://localhost:8000/');
        const res = await app.fetch(req);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ message: "Sarmad Practice API" });
    });

    it('Should return 200 Response for /user endpoint with correct data', async () => {

        const req = new Request('http://localhost:8000/user',
            {
                headers: {
                    'x-user-name': USER_NAME!,
                    'x-user-email': USER_EMAIL!,
                    'x-user-id': USER_ID!,
                },
            }
        );

        const res = await app.fetch(req);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            id: USER_ID,
            name: USER_NAME,
            email: USER_EMAIL,
            message: "Hello from Hono API with bun!",
        });
    });
});