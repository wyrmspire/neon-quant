import { JournalPort, JournalPayload } from '../ports/game';
import { JournalEntry } from '../types';
import { mockDb } from './mockDb';

class MockJournalService implements JournalPort {
    async save(payload: JournalPayload): Promise<void> {
        const newEntry: JournalEntry = {
            ...payload,
            id: `journal_${Date.now()}`,
            timestamp: new Date().toISOString(),
        };

        mockDb.write(db => {
            db.journal.push(newEntry);
        });

        console.log("Journal Entry Saved:", newEntry);
        return Promise.resolve();
    }
}

export const mockJournal = new MockJournalService();
