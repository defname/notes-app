import { Alert } from "@mantine/core"
import { IconExclamationCircle } from "@tabler/icons-react"
import { PropsWithChildren } from "react"
import { FallbackProps, ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"

function getFallbackComponent(title: string, message: string) {
  return function Fallback({ }: FallbackProps) {

    return <Alert
      variant="light"
      icon={ <IconExclamationCircle /> }
      radius="md"
      color="red"
      title={ title }
    >
      { message }
    </Alert>
  }
}

type ErrorBoundaryProps = PropsWithChildren<{
  title?: string
  message?: string
}>

export default function ErrorBoundary({ children, title = "Fehler", message = "Es ist ein Problem aufgetreten."}: ErrorBoundaryProps) {
  return <ReactErrorBoundary FallbackComponent={ getFallbackComponent(title, message) }>
    { children }
  </ReactErrorBoundary>
}