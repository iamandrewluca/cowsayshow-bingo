import {
	useState,
	useMemo,
	Fragment,
	useRef,
	FormEvent,
	useEffect,
} from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
// @ts-expect-error
import useSound from "use-sound";
import cx from "clsx";

// prettier-ignore
const items = [
	{ text: `AI ne lasă fără de lucru`, checked: false },
	{ text: `Apare un nou clon la twitter`, checked: false },
	{ text: `Right to repair`, checked: false },
	{ text: `Cineva îmbracă (metaforic) o beretă din folie de aluminiu`, checked: false },
	{ text: `Spunem cuvintele Elon și Anime într-o propoziție`, checked: false },
	{ text: `Ceva nu de bine despre Rust 😱`, checked: false },
	{ text: `Vlad spune cuvântul "speculativ"`, checked: false },
	{ text: `Ceva cu gaming nu de bine`, checked: false },
	{ text: `Vanea face o glumă la care nimeni nu râde`, checked: false },
	{ text: `Am uitat să spunem că "Văcuța vă iubește"`, checked: false },
	{ text: `Epizod fără cuvântul "layoffs"`, checked: false },
	{ text: `Moldovenii fac un app inutil`, checked: false },
	{ text: `Cowsay: Cineva a zis Mu in microfon`, checked: false },
	{ text: `Glumă despre Voronin`, checked: false },
	{ text: `Lăudăm JavaScript (Sau un nou npm framework)`, checked: false },
	{ text: `Menționăm Mastodon moldovenesc`, checked: false },
	{ text: `Câine în eter`, checked: false },
	{ text: `Tiktok în judecată`, checked: false },
	{ text: `Moldovenii fac un app util`, checked: false },
	{ text: `Vorbim despre ML fara să menționăm Python`, checked: false },
	{ text: `Vorbim despre legislație timp de 5 minute`, checked: false },
	{ text: `Spunem ceva bine despre Bitcoin`, checked: false },
	{ text: `Cowsay evită să spună numele lui Elon`, checked: false },
	{ text: `AI ne aduce la comunism`, checked: false },
	{ text: `Spunem cuvintele Elon și Anime într-o propoziție`, checked: false },
];

const size = 5;

function getRowCol(index: number) {
	const row = Math.floor(index / size);
	const col = index % size;
	return { row, col };
}

export function App() {
	const [soundEnabled, setSoundEnabled] = useState(true);
	const { width, height } = useWindowSize();
	const [checkboxes, setCheckboxes] = useState(items);
	const [isOpen, setIsOpen] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [playClick] = useSound("/click.mp3", { soundEnabled });
	const [play, { stop }] = useSound("/cheering.mp3", {
		interrupt: true,
		loop: true,
		soundEnabled,
	});

	function saveItems(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const newItems =
			textareaRef.current?.value
				.split("\n")
				.map((text) => ({ text, checked: false })) ?? [];

		setCheckboxes(newItems);
		setIsOpen(false);
	}

	function changeItem(index: number) {
		return (checked: boolean) => {
			playClick();
			const newItems = [...checkboxes];
			newItems[index].checked = checked;
			setCheckboxes(newItems);
		};
	}

	const { checkedCols, checkedRows, allChecked } = useMemo(() => {
		const rows: Record<number, number> = {};
		const cols: Record<number, number> = {};
		let checkCount = 0;

		checkboxes.forEach((item, index) => {
			const { row, col } = getRowCol(index);

			const rowCount = rows[row] ?? 0;
			const colCount = cols[col] ?? 0;

			rows[row] = item.checked ? rowCount + 1 : rowCount;
			cols[col] = item.checked ? colCount + 1 : colCount;

			checkCount += item.checked ? 1 : 0;
		});

		const checkedRows = Object.entries(rows).map(([row, count]) => [
			row,
			count === size,
		]);

		const checkedCols = Object.entries(cols).map(([col, count]) => [
			col,
			count === size,
		]);

		return {
			checkedRows: Object.fromEntries(checkedRows),
			checkedCols: Object.fromEntries(checkedCols),
			allChecked: checkCount === checkboxes.length,
		};
	}, [checkboxes]);

	useEffect(() => {
		if (allChecked) {
			play();
		} else {
			stop();
		}
	}, [allChecked]);

	return (
		<main className="min-h-screen flex max-w-3xl mx-auto px-4 flex-col">
			{allChecked && (
				<Confetti width={width} height={height} numberOfPieces={500} />
			)}
			<header className="my-4 rounded-lg p-4 bg-gray-50 flex gap-3 items-center">
				<strong>BINGO!</strong>

				<button
					className="ml-auto hover:text-gray-500"
					onClick={() => setSoundEnabled(!soundEnabled)}
				>
					{soundEnabled ? (
						<IconSpeaker className="w-6 h-6" />
					) : (
						<IconSpeakerX className="w-6 h-6" />
					)}
				</button>

				<button className="hover:text-gray-500" onClick={() => setIsOpen(true)}>
					<IconEdit className="w-6 h-6" />
				</button>
			</header>
			<ul
				className="grid grid-cols-5 grid-rows-5 gap-4 font-semibold font-mono"
				style={{
					fontSize: "clamp(0.5rem, 1vw, 0.75rem)",
				}}
			>
				{checkboxes.map((item, index) => {
					const { col, row } = getRowCol(index);

					const isCol = checkedCols[col];
					const isRow = checkedRows[row];

					return (
						<li
							key={index}
							className={cx("border-2 relative sm:aspect-square rounded-lg", {
								"bg-gray-50 shadow-inner hover:bg-gray-100": !allChecked,
								"border-cowsay text-cowsay": !allChecked && (isCol || isRow),
								"bg-cowsay border-cowsay shadow-inner hover:bg-cowsay/50": allChecked,
							})}
						>
							<Switch
								checked={item.checked}
								onChange={changeItem(index)}
								className="w-full h-full p-1 lg:p-5"
							>
								<span className="flex justify-center">{item.text}</span>
								{item.checked && !(isCol || isRow) && (
									<IconCheck className="absolute bottom-1 right-1 w-3 h-3 sm:bottom-2 sm:right-2 sm:w-6 sm:h-6 text-red-500" />
								)}
							</Switch>
						</li>
					);
				})}
			</ul>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={() => setIsOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel
									as="form"
									onSubmit={saveItems}
									className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
								>
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Editează opțiunile
									</Dialog.Title>
									<div className="mt-2">
										<textarea
											className="text-sm w-full resize-y text-gray-500 p-4 border"
											rows={25}
											ref={textareaRef}
											defaultValue={checkboxes
												.map((item) => item.text)
												.join("\n")}
										/>
									</div>

									<div className="mt-4">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
										>
											Salvează
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</main>
	);
}

function IconCheck(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
			/>
		</svg>
	);
}

function IconEdit(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
			/>
		</svg>
	);
}

function IconSpeaker(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
			/>
		</svg>
	);
}

function IconSpeakerX(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth={1.5}
			stroke="currentColor"
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
			/>
		</svg>
	);
}
