const REACT_APP_API_URL = process.env.REACT_APP_API_URL
export default function (gameId) {

    return (async () => {
        const response = await fetch(`${REACT_APP_API_URL}/games/${gameId}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'authorization': `bearer ${sessionStorage.token}` },
        })

        if (response.status !== 201) {
            const { error } = await response.json()
            throw Error(error)
        } else {
            await response.json()
            this.__gameId__ = gameId
            return
        }
    })()
}