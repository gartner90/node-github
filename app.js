const got = require('got');
const _ = require('lodash');

const githubToken = 'Token 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';
const headers = {'User-Agent': 'request', 'Authorization': githubToken};
let username = 'awslabs';
let repos = [];

const options = {
    host: 'api.github.com',
    path: `/users/${username}`,
    headers,
};

(async () => {
    try {
        const response = await got(options, { json: true });
        const pages = Math.ceil(response.body.public_repos / 100);
        process.stdout.write(`Github Repos and count of languages by ${username} \n\n`);
        
        async function* asyncGenerator() {
            let i = 0;
            while (i < pages) {
                yield i++;
            }
        }
        process.stdout.write('0%');
        for await (let page of asyncGenerator()) {
            asyncCall(page + 1, pages);
        }

    } catch (error) {
        process.stdout.write('Github username not found \n');
    }
})();

async function asyncCall(page, totalPages) {
    const options = {
        host: 'api.github.com',
        path: `/users/${username}/repos?per_page=100&page=${page}`,
        headers,
    };

    (async () => {
        try {
            const response = await got(options, { json: true });
            response.body.forEach(element => {
                process.stdout.write(`.`);
                repos.push(element.language);
            });
            if(page == totalPages) {
                setTimeout(() => {
                    const reposGrouped = _.groupBy(repos);
                    process.stdout.write('100% \n');
                    for (let [key] of Object.entries(reposGrouped)) {
                        process.stdout.write(`${key}: ${reposGrouped[key].length}\n`);
                    }
                }, 3000);
            }
        } catch (error) {
            process.stdout.write(error);
        }
    })();
}