/**
 * Middleware to enforce multi-tenancy by extracting universityId from the authenticated user.
 * This ensures all queries are scoped to the student's or staff's university.
 */
exports.tenantHandler = (req, res, next) => {
    // universityId comes from the protect middleware (decoded from JWT)
    if (!req.user || !req.user.universityId) {
        if (req.user && req.user.role === 'super-admin') {
            // Super admins can access everything, but we might want them to pick a universityId in some contexts.
            return next();
        }
        return res.status(403).json({ success: false, message: 'Access denied: No University ID found' });
    }

    req.universityId = req.user.universityId;
    next();
};

/**
 * Utility to filter queries by universityId automatically.
 * Use this in controllers to ensure data isolation.
 */
exports.scopeToUniversity = (query, universityId) => {
    if (!universityId) return query; // If super-admin or similar
    return { ...query, universityId };
};
