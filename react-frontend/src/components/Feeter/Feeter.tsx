const Feeter = () => {
    return (
        <div className="flex h-[var(--small-footer-height)] w-full items-center justify-between bg-secondary px-8 text-primary md:h-[var(--big-footer-height)] md:px-16">
            <span className="text-3xl font-bold text-primary md:text-5xl">
                Pokerinee
            </span>
            <span className="text-xl text-primary">&copy; Pokerinee</span>
        </div>
    );
};

export default Feeter;
