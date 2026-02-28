import { generateMathTask } from './engine';

describe('Arithmetic Engine', () => {
    test('m1: Addition ZR 10', () => {
        for (let i = 0; i < 20; i++) {
            const task = generateMathTask('m1');
            const [a, b] = task.question.split(' + ').map(Number);
            expect(a + b).toBe(task.answer);
            expect(a + b).toBeLessThanOrEqual(10);
        }
    });

    test('m3: Zehnerübergang (ZR 20)', () => {
        for (let i = 0; i < 20; i++) {
            const task = generateMathTask('m3');
            const [a, b] = task.question.split(' + ').map(Number);
            expect(a + b).toBe(task.answer);
            expect(a + b).toBeGreaterThan(10);
            expect(a).toBeGreaterThanOrEqual(6);
            expect(b).toBeGreaterThanOrEqual(1);
            expect(task.metadata.step).toBe(10 - a);
        }
    });

    test('m5: ZR 100 with carrying', () => {
        for (let i = 0; i < 20; i++) {
            const task = generateMathTask('m5');
            const [a, b] = task.question.split(' + ').map(Number);
            expect(a + b).toBe(task.answer);
            expect(a % 10 + b).toBeGreaterThanOrEqual(10);
            expect(task.metadata.step).toBe(10 - (a % 10));
        }
    });

    test('s3: Subtraction with crossing', () => {
        for (let i = 0; i < 20; i++) {
            const task = generateMathTask('s3');
            const [a, b] = task.question.split(' - ').map(Number);
            expect(a - b).toBe(task.answer);
            expect(a).toBeLessThanOrEqual(15);
            expect(a - b).toBeLessThan(10);
            expect(task.metadata.step).toBe(a - 10);
        }
    });
});
