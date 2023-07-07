import { useState, useMemo } from "react";
import { Switch } from "@headlessui/react";
import cx from "clsx";

const items = [
	{ text: `AI ne lasă fără de lucru`, checked: false },
	{ text: `Apare un nou clon la twitter`, checked: false },
	{ text: `Right to repair`, checked: false },
	{
		text: `Cineva îmbracă (metaforic) o beretă din folie de aluminiu`,
		checked: false,
	},
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

function getRowCol(index: number) {
	const row = Math.floor(index / 5);
	const col = index % 5;
	return { row, col };
}

export function App() {
	const [checkboxes, setCheckboxes] = useState(items);

	function changeItem(index: number) {
		return (checked: boolean) => {
			const newItems = [...checkboxes];
			newItems[index].checked = checked;
			setCheckboxes(newItems);
		};
	}

	const allChecked = checkboxes.every((item) => item.checked);

	const { checkedCols, checkedRows } = useMemo(() => {
		const rows = new Map<number, number>();
		const cols = new Map<number, number>();

		checkboxes.forEach((item, index) => {
			const { row, col } = getRowCol(index);
			if (item.checked) {
				rows.set(row, (rows.get(row) ?? 0) + 1);
				cols.set(col, (cols.get(col) ?? 0) + 1);
			} else {
				rows.set(row, 0);
				cols.set(col, 0);
			}
		});

		return { checkedCols: cols, checkedRows: rows };
	}, [checkboxes]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<ul className="grid grid-cols-5 grid-rows-5 max-w-4xl gap-4 text-center font-semibold">
				{checkboxes.map((item, index) => {
					const { col, row } = getRowCol(index);

					const isCol = checkedCols.get(col) === 5;
					const isRow = checkedRows.get(row) === 5;

					return (
						<li
							key={index}
							className={cx("relative aspect-square", {
								"bg-teal-200": !allChecked && !isCol && !isRow,
								"bg-blue-500": !allChecked && isCol,
								"bg-orange-500": !allChecked && isRow,
								"bg-red-500": allChecked,
							})}
						>
							<Switch
								checked={item.checked}
								onChange={changeItem(index)}
								className="w-full h-full p-5"
							>
								<span>{item.text}</span>
								{item.checked && (
									<Icon className="absolute bottom-2 right-2 w-6 h-6 text-red-500 " />
								)}
							</Switch>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function Icon(props: JSX.IntrinsicElements["svg"]) {
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
