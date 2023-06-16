// main Seite
export const renderIndex = (req, res) => {
    const locals = {
        title: 'Beste Notizanwendung | Organisiere deine Notizen mit Noti',
        description: 'Unsere Notizanwendung hilft dir dabei, deine Ideen, Projekte zu erfassen und zu priorisieren. Nutze die kostenlose Probephase noch heute!',
    };
    res.render('index', { locals });
};
// Warum noti menu link
export const renderWhy = (req, res) => {
    const locals = {
        title: 'Konzentriere dich auf die wichtigen Dinge | Noti',
        description:
            'Lerne die unzähligen Möglichkeiten kennen, wie Noti dir dabei helfen kann, dir alles zu merken, besser organisiert zu sein und konzentrierter mit deinem Team zusammenzuarbeiten.',
    };
    res.render('menu', { locals });
};
// 404 Seite
export const renderNotFound = (req, res) => {
    const locals = {
        title: 'Seite nicht gefunden | Noti',
        description: 'Seite nicht gefunden | Noti',
    };
    res.status(404).render('404', { locals });
};
