fetch('data/data-versions.json?cacheBust=' + Date.now())
            .then(r => r.json())
            .then(versions => {
                const list = document.getElementById('versions-list');
                list.innerHTML = versions
                    .slice().reverse()
                    .map(v => `
                        <div class="version-item">
                            <div>
                                <span class="version-title">v${v.version}</span>
                                <span class="version-date">${v.date || ''}</span>
                            </div>
                            <div class="version-desc">${v.description || ''}</div>
                        </div>
                    `).join('');
            });