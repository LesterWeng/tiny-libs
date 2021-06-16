import React, {
  useState,
  useEffect,
  useContext,
} from 'React'

let listeners = []
let location = null
const history = {
  listen: (cb) => {
    listeners.push(cb)
  },
  push: (pathname, state) => {
    location = {
      pathname,
      state,
    }

    window.history.pushState(state, '', pathname)

    listeners.forEach((cb) => cb(location))
  },
}

const RouterContext = React.createContext(null)

export const Router = ({ children }) => {
  const [location, setLocation] = useState(null)
  useEffect(() => {
    const unListen = history.listen((location) =>
      setLocation(location),
    )
    return () => {
      unListen()
    }
  }, [])

  return (
    <RouterContext.Provider
      value={{ location, history }}
    >
      {children}
    </RouterContext.Provider>
  )
}

export const Route = ({ pathname, children }) => {
  const { location, history } = useContext(
    RouterContext,
  )

  return location?.pathname === pathname
    ? React.cloneElement(children, {
        location,
        history,
      })
    : null
}

export const useLocation = () => {
  return useContext(RouterContext).location
}

export const useHistory = () => {
  return useContext(RouterContext).history
}
