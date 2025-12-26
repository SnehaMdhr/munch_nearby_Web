


export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section>
            header
            {children}
            footer
        </section>
    );
}