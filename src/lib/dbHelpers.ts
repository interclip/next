import { db } from './prisma';

/**
 * 
 * @param email an email associated with a user
 * @returns a UUID associated with the email provided, if no user is found, `null` is returned
 */
export const getUserIDFromEmail = async (email: string | null | undefined) => {
    if (!email) {
        return null;
    }
    const user = await db.user.findUnique({
        where: {
            email
        }
    });
    return user?.id || null;
}