const mongoose = require('mongoose');

/**
 * One document per issued refresh token (i.e. per login session), so a
 * user can have several valid sessions at once (phone + laptop, etc).
 *
 * The raw refresh token is NEVER stored — only a keyed HMAC hash of it
 * (see services/authService.js:hashToken). `jti` lets us look a session
 * up in O(1) without needing to hash-compare against every row.
 */
const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    jti: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    revoked: {
        type: Boolean,
        default: false
    },
    revokedAt: {
        type: Date,
        default: null
    },
    // Set when this token is rotated out for a newer one — useful for
    // tracing a session's rotation chain and for reuse detection.
    replacedByJti: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    ip: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// MongoDB TTL index: documents are automatically deleted once expiresAt
// has passed, so expired sessions clean themselves up.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);