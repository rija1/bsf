const consentType = {
    gdpr: 'optin',
    ccpa: 'optout',
};
const categoryMap = {
    functional: 'preferences',
    analytics: ['statistics','statistics-anonymous'],
    performance: 'functional',
    advertisement: 'marketing',
};
document.addEventListener("cookieyes_consent_update", function () {
    const consentData = getCkyConsent();
    const categories = consentData.categories;
    window.wp_consent_type = consentData.activeLaw ? consentType[consentData.activeLaw] : 'optin';
    let event = new CustomEvent('wp_consent_type_defined');
    document.dispatchEvent( event );
    Object.entries(categories).forEach(([key, value]) => {
        if (!(key in categoryMap))
            return;
        setConsentStatus(key, value ? 'allow' : 'deny');
    });
    function setConsentStatus(key, status) {
        if (Array.isArray(categoryMap[key])) {
            categoryMap[key].forEach(el => {
                wp_set_consent(el, status);
            });
        } else {
            wp_set_consent(categoryMap[key], status);
        }
    }
});