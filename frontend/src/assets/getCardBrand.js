export function getCardBrand(cardNumber) {
    // Remove any non-digit characters (spaces, dashes)
    const cleanedNumber = cardNumber.replace(/\D/g, '');

    // Check for valid length
    if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
        return 'Invalid card number';
    }

    // Check card brand based on the starting digits
    const firstDigit = cleanedNumber.charAt(0);
    const firstTwoDigits = cleanedNumber.slice(0, 2);
    const firstFourDigits = cleanedNumber.slice(0, 4);

    if (firstDigit === '4') {
        return 'Visa';
    } else if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) {
        return 'MasterCard';
    } else if (['34', '37'].includes(firstTwoDigits)) {
        return 'American Express';
    } else if (['6011', '644', '645', '646', '647', '648', '649', '65'].includes(firstTwoDigits) || firstFourDigits === '6011') {
        return 'Discover';
    } else if (['3528', '3529', '3530', '3531', '3532', '3533', '3534', '3535', '3536', '3537', '3538', '3539', 
                 '3540', '3541', '3542', '3543', '3544', '3545', '3546', '3547', '3548', '3549', 
                 '3550', '3551', '3552', '3553', '3554', '3555', '3556', '3557', '3558', '3559', 
                 '3560', '3561', '3562', '3563', '3564', '3565', '3566', '3567', '3568', '3569', 
                 '3570', '3571', '3572', '3573', '3574', '3575', '3576', '3577', '3578', '3579', 
                 '3580', '3581', '3582', '3583', '3584', '3585', '3586', '3587', '3588', '3589'].includes(firstFourDigits)) {
        return 'JCB';
    } else if (['300', '301', '302', '303', '304', '305', '36', '38'].includes(firstTwoDigits)) {
        return 'Diners Club';
    }

    return 'Unknown card brand';
}