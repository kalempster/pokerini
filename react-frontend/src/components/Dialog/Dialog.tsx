/* eslint-disable react/prop-types */
// Bugging out in Dialog component, known issue
import React, { FC, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ReactDOM from "react-dom";
import { ScrollLocker } from "../../utils/ScrollLocker";

const dialogRoot = document.getElementById("dialog-root");

type Props = {
    children?: React.ReactNode;
    //We don't care about the return type here so that's why I'm disabling next line
    /**
     * The function that will fire when the dialog gets dismissed by clicking on the background.
     * @example
     * ```tsx
     * const [visible, setVisible] = useState(true);
     *
     * <Dialog onDismiss={() => setVisible(false)} visible={visible}></Dialog>
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDismiss?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;

    /**
     * Is the dialog visible on the screen
     * @default false
     * @example
     * ```tsx
     * <Dialog visible={true}></Dialog>
     * ```
     */
    visible?: boolean;
};

type DialogType = FC<Props> & {
    Title: typeof Title;
    Content: typeof Content;
    Actions: typeof Actions;
};

/**
 * A dialog that will be displayed on the page with a black backdrop with 0.5 opacity
 *
 * @example
 * ```tsx
 * <Dialog>
 *    <Dialog.Title>Hey!</Dialog.Title>
 *    <Dialog.Content>
 *        Lorem ipsum dolor sit amet consectetur adipisicing elit.
 *    </Dialog.Content>
 *    <Dialog.Actions>
 *        <button>Ok</button>
 *    </Dialog.Actions>
 * </Dialog>
 * ```
 */

const Dialog: DialogType = ({ children, onDismiss, visible = false }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (visible) ScrollLocker.lock();
        else ScrollLocker.unlock();
    }, [visible]);

    if (!dialogRoot) throw new Error("Unable to find dialog root");

    return ReactDOM.createPortal(
        <AnimatePresence>
            {visible && (
                <motion.div
                    ref={modalRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onDismiss}
                    className="fixed z-50 h-full w-full bg-black bg-opacity-50">
                    <motion.div
                        initial={{ translateY: "2rem" }}
                        animate={{ translateY: "0" }}
                        exit={{ translateY: "2rem" }}
                        transition={{
                            duration: 0.5,
                            type: "spring"
                        }}
                        className="flex h-full w-full items-center justify-center md:h-1/2">
                        <div
                            // Prevent dismissing by clicking on the dialog
                            onClick={(e) => e.stopPropagation()}
                            className="mx-6 flex w-full flex-col gap-5 rounded-md bg-background p-4 md:mx-0 md:w-1/2 xl:w-1/4">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        dialogRoot
    );
};

type TitleProps = {
    children: string;
    /**
     * Classes that will override the default styles.
     */
    className?: string;
};

const Title = ({ children, className }: TitleProps) => {
    return (
        <div className={className ? className : "w-full text-3xl text-white "}>
            {children}
        </div>
    );
};

type ContentProps = {
    children: React.ReactNode;
    /**
     * Classes that will override the default styles.
     */
    className?: string;
};

const Content: FC<ContentProps> = ({ children, className }) => {
    return (
        <div className={className ? className : "text-white"}>{children}</div>
    );
};

type ActionsProps = {
    children: React.ReactNode;
    /**
     * Classes that will be added to the default styles
     */
    className?: string;
};
const Actions: FC<ActionsProps> = ({ children, className }) => {
    return (
        <div className={`flex w-full justify-end text-white ${className}`}>
            {children}
        </div>
    );
};

Dialog.Title = Title;
Dialog.Content = Content;
Dialog.Actions = Actions;

export default Dialog;
