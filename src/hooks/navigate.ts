import { useLocation, useNavigate as useRouterNavigate } from "react-router"

export function useNavigate() {
  const routerNavigate = useRouterNavigate()
  const location = useLocation()

  function navigate(to: string|number) {
    if (typeof to === "number") {
      return routerNavigate(to)
    }
    if (location.pathname.startsWith("/add")
        || location.pathname.startsWith("/create")
        || location.pathname.startsWith("/edit")) {
      return routerNavigate(to, {replace: true})
    }
    return routerNavigate(to)
  }

  return navigate
}