import { Fragment, useCallback, useMemo, useState } from 'react';

import { CopyCheckIcon, CopyIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { convertFilesToTreeItems, getLanguageFromExtension } from '@/lib/utils';

import { CodeView } from './code-view';
import { Hint } from './hint';
import { TreeView } from './tree-view';

type FileCollection = { [path: string]: string };

interface FileBreadcrumbProps {
	filePath: string;
}

const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
	const pathSegments = filePath.split('/');
	const maxSegments = 3;

	const renderBreadcrumbItem = () => {
		if (pathSegments.length <= maxSegments) {
			// Show all segments less than or equal to maxSegments
			return pathSegments.map((segment, index) => {
				const isLast = index === pathSegments.length - 1;

				return (
					<Fragment key={index}>
						<BreadcrumbItem>
							{isLast ? (
								<BreadcrumbPage className='font-medium'>{segment}</BreadcrumbPage>
							) : (
								<span className='text-muted-foreground'>{segment}</span>
							)}
						</BreadcrumbItem>

						{!isLast && <BreadcrumbSeparator />}
					</Fragment>
				);
			});
		} else {
			const firstSegment = pathSegments[0];
			const lastSegment = pathSegments[pathSegments.length - 1];

			return (
				<>
					<BreadcrumbItem>
						<span className='text-muted-foreground'>{firstSegment}</span>
					</BreadcrumbItem>

					<BreadcrumbSeparator />

					<BreadcrumbItem>
						<BreadcrumbEllipsis />
					</BreadcrumbItem>

					<BreadcrumbSeparator />

					<BreadcrumbItem>
						<BreadcrumbPage className='font-medium'>{lastSegment}</BreadcrumbPage>
					</BreadcrumbItem>
				</>
			);
		}
	};

	return (
		<Breadcrumb>
			<BreadcrumbList>{renderBreadcrumbItem()}</BreadcrumbList>
		</Breadcrumb>
	);
};

interface FileExplorerProps {
	files: FileCollection;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
	const [copied, setCopied] = useState(false);
	const [selectedFile, setSelectedFile] = useState<string | null>(() => {
		const fileKeys = Object.keys(files);

		return fileKeys.length > 0 ? fileKeys[0] : null;
	});

	const treeData = useMemo(() => {
		return convertFilesToTreeItems(files);
	}, [files]);

	const handleFileSelect = useCallback(
		(filePath: string) => {
			if (files[filePath]) setSelectedFile(filePath);
		},
		[files]
	);

	const handleCopy = useCallback(() => {
		if (!selectedFile) return;

		try {
			navigator.clipboard.writeText(files[selectedFile]);
			setCopied(true);

			setTimeout(() => setCopied(false), 2000); // 2 seconds
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to copy to clipboard');
		}
	}, [selectedFile, files]);

	return (
		<ResizablePanelGroup orientation='horizontal'>
			<ResizablePanel defaultSize={30} minSize={30} className='bg-sidebar'>
				<TreeView data={treeData} value={selectedFile} onSelect={handleFileSelect} />
			</ResizablePanel>

			<ResizableHandle className='hover:bg-primary transition-colors' />

			<ResizablePanel defaultSize={70} minSize={50}>
				{!!selectedFile && !!files[selectedFile] ? (
					<div className='flex size-full flex-col'>
						<div className='bg-sidebar flex items-center justify-between gap-x-2 border-b px-4 py-2'>
							<FileBreadcrumb filePath={selectedFile} />

							<Hint text='Copy to clipboard' side='left'>
								<Button variant='outline' size='icon' className='ml-auto' onClick={handleCopy} disabled={copied}>
									{copied ? <CopyCheckIcon /> : <CopyIcon />}
								</Button>
							</Hint>
						</div>

						<div className='custom-scrollbar flex-1 overflow-auto'>
							<CodeView code={files[selectedFile]} lang={getLanguageFromExtension(selectedFile)} />
						</div>
					</div>
				) : (
					<div className='text-muted-foreground flex h-full items-center justify-center'>
						Select a file to view it&apos;s content
					</div>
				)}
			</ResizablePanel>
		</ResizablePanelGroup>
	);
};
