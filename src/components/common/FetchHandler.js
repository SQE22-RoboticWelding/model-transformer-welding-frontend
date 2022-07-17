class FetchHandler {
    static simple = (fetchPromise) => new Promise((resolve, reject) => {
        fetchPromise
            .then(response => {
                if (response.ok) {
                    resolve(response);
                } else {
                    response.text()
                        .then(reject)
                        .catch(err => reject(`Received non-ok response. Unable to determine why: ${err}`));

                }
            })
            .catch(err => reject(err));
    });

    static readingJson = (fetchPromise) => new Promise((resolve, reject) => {
        FetchHandler.simple(fetchPromise)
            .then((response) => response.json()
                .then(resolve)
                .catch((err) => reject(`Unable to read response: ${err}`)))
            .catch(reject);
    });
}


export default FetchHandler;