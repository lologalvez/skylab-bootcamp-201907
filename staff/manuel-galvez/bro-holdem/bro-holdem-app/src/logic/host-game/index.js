const REACT_APP_API_URL = process.env.REACT_APP_API_URL
export default function (name, maxPlayers, initialStack, initialBB, initialSB, blindsIncrease) {

    // Convert specific fields retrieved from form as strings to numbers
    maxPlayers = Number(maxPlayers)
    initialStack = Number(initialStack)
    initialBB = Number(initialBB)
    initialSB = Number(initialSB)
    blindsIncrease = Number(blindsIncrease)

    /*validate.string(email, 'email')
    validate.email(email, 'email')
    validate.string(password, 'password')*/

    return (async () => {
        const response = await fetch(`${REACT_APP_API_URL}/games`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', 'authorization': `bearer ${sessionStorage.token}` },
            body: JSON.stringify({
                name,
                maxPlayers,
                initialStack,
                initialBB,
                initialSB,
                blindsIncrease
            })
        })

        if (response.status !== 201) {
            const { error } = await response.json()
            throw Error(error)
        } else {
            const resp = await response.json()
            return resp.gameId
        }
    })()
}