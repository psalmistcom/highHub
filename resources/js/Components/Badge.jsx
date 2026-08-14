export default function Badge({ status, children }) {
    return <span className={`stamp stamp-${status}`}>{children}</span>;
}
