function ellipsisEmail(email: string, maxUsername = 6): string {
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    // Ellipsis username
    const trimmedUsername = username.length > maxUsername
        ? username.slice(0, maxUsername) + '***'
        : username;

    // Ellipsis domain
    const lastDotIndex = domain.lastIndexOf('.');
    if (lastDotIndex === -1) return `${trimmedUsername}@***`; // fallback if domain is weird

    const domainName = domain.slice(0, lastDotIndex);
    const tld = domain.slice(lastDotIndex + 1); // e.g. "com"

    const domainPrefix = domainName.slice(0, 3); // ambil 3 karakter pertama
    const obfuscatedDomain = `${domainPrefix}***.${tld}`;

    return `${trimmedUsername}@${obfuscatedDomain}`;
}
