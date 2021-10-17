import type { NextApiRequest, NextApiResponse } from 'next'
import { APIResponse } from '../../lib/types';
import { db } from '../../lib/prisma';
import { getSession } from "next-auth/react"
import { getUserIDFromEmail } from '../../lib/dbHelpers';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<APIResponse>
) {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).json({
            status: 'error',
            result: 'Unauthenticated.'
        });
    }

    const queriedClips = db.clip.findMany({
        where: {
            ownerID: await getUserIDFromEmail(session?.user?.email),
        }
    });

    try {
        const result = await queriedClips;
        res.status(200).json({ status: 'success', result: result })
    } catch (e) {
        res.status(500).json({
            status: 'error',
            result: 'An error with the database has occured.'
        });
    }
}
