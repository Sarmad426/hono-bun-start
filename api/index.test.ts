import { describe, expect, it } from 'bun:test';
import app from './basic-api';

describe('API Tests', () => {
    it('Should return 200 Response for root endpoint', async () => {
        const req = new Request('http://localhost:8000');
        const res = await app.fetch(req);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ message: "Sarmad Practice API" });
    });
})
