import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/Components/ui/Card'
import { Button } from '@/Components/ui/Button'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { ScrollArea } from "@/Components/ui/Scroll-area"
import { Label } from "@/Components/ui/Label"
import { RadioGroup, RadioGroupItem } from "@/Components/ui/Radio-group"
import { Input } from "@/Components/ui/Input"
import { Search } from 'lucide-react'
import ProjectCard from '../Project/ProjectCard'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProjects, searchProjects } from '../../Redux/Project/Action'

export const tags = [
    "all", "react", "nextjs", "springboot", "mysql", "mongodb", "angular", "python", "flask", "django"
]

const tagMapping = {
    "all": "all",
    "react": "react",
    "nextjs": "nextjs",
    "spring boot": "springboot",
    "springboot": "springboot",
    "mysql": "mysql",
    "mongodb": "mongodb",
    "angular": "angular",
    "python": "python",
    "flask": "flask",
    "django": "django"
};

const getTagBackendValue = (displayTag) => {
    return tagMapping[displayTag.toLowerCase()] || displayTag.toLowerCase().replace(/\s+/g, '');
};

const ProjectList = () => {
    const [keyword, setKeyword] = useState("");
    const [filters, setFilters] = useState({ category: 'all', tag: 'all' });
    const { project } = useSelector(store => store);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!keyword.trim()) {
            if (filters.category !== 'all' || filters.tag !== 'all') {
                const filterParams = {};
                if (filters.category !== 'all') filterParams.category = filters.category;
                if (filters.tag !== 'all') filterParams.tag = filters.tag;
                dispatch(fetchProjects(filterParams));
            } else {
                dispatch(fetchProjects());
            }
        }
    }, [dispatch, filters, keyword]);

    useEffect(() => {
        if (keyword.trim()) {
            const delayDebounce = setTimeout(() => {
                dispatch(searchProjects(keyword));
            }, 500);
            return () => clearTimeout(delayDebounce);
        } else {
            if (filters.category !== 'all' || filters.tag !== 'all') {
                const filterParams = {};
                if (filters.category !== 'all') filterParams.category = filters.category;
                if (filters.tag !== 'all') filterParams.tag = filters.tag;
                dispatch(fetchProjects(filterParams));
            } else {
                dispatch(fetchProjects());
            }
        }
    }, [keyword, dispatch, filters]);

    const handleFilterChange = (type, value) => {
        if (keyword.trim()) {
            setKeyword("");
        }

        const processedValue = type === 'tag' ? getTagBackendValue(value) : value;

        setFilters(prev => ({
            ...prev,
            [type]: processedValue
        }));
    }

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
    }

    const getProjectsToDisplay = () => {
        if (keyword.trim()) {
            if (Array.isArray(project.searchProject)) {
                return project.searchProject;
            } else if (project.searchProject?.data) {
                return project.searchProject.data;
            }
            return [];
        }

        if (Array.isArray(project.project)) {
            return project.project;
        } else if (project.project?.data) {
            return project.project.data;
        }
        return [];
    };

    return (
        <div
            className="relative px-5 lg:px-0 lg:flex gap-5 justify-center py-5"
            style={{
                backgroundImage: "url('/Assets/image.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh'
            }}
        >
            {/* Filter Section - Styled per Figma */}
            <section className='filterSection'>
                <Card className='p-6 sticky top-10 bg-[#7BB3E8] border-none shadow-lg rounded-3xl'>
                    <div className='flex justify-between lg:w-[20rem] mb-6'>
                        <h2 className='text-2xl font-semibold text-gray-900'>Filters</h2>
                        <Button variant="ghost" size="icon" className="hover:bg-white/20">
                            <MixerHorizontalIcon className="h-5 w-5" />
                        </Button>
                    </div>
                    <CardContent className='p-0'>
                        <ScrollArea className="h-[70vh]">
                            <div className="space-y-8">
                                {/* Category Filter */}
                                <div>
                                    <h3 className='pb-3 text-sm font-medium text-gray-700 uppercase tracking-wide'>Category</h3>
                                    <div className='pt-2'>
                                        <RadioGroup
                                            className="space-y-3 bg-[#D4E4F3] rounded-2xl p-4"
                                            value={filters.category}
                                            onValueChange={(value) => handleFilterChange("category", value)}
                                            disabled={keyword.trim() !== ""}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem 
                                                    value='all' 
                                                    id='cat-all'
                                                    className="border-2 border-gray-600 text-blue-600"
                                                />
                                                <Label htmlFor="cat-all" className="text-base font-medium text-gray-900 cursor-pointer">
                                                    All
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem 
                                                    value='frontend' 
                                                    id='cat-frontend'
                                                    className="border-2 border-gray-600 text-blue-600"
                                                />
                                                <Label htmlFor="cat-frontend" className="text-base font-medium text-gray-900 cursor-pointer">
                                                    Frontend
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem 
                                                    value='fullstack' 
                                                    id='cat-fullstack'
                                                    className="border-2 border-gray-600 text-blue-600"
                                                />
                                                <Label htmlFor="cat-fullstack" className="text-base font-medium text-gray-900 cursor-pointer">
                                                    Full Stack
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <RadioGroupItem 
                                                    value='backend' 
                                                    id='cat-backend'
                                                    className="border-2 border-gray-600 text-blue-600"
                                                />
                                                <Label htmlFor="cat-backend" className="text-base font-medium text-gray-900 cursor-pointer">
                                                    Backend
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>

                                {/* Tags Filter */}
                                <div>
                                    <h3 className='pb-3 text-sm font-medium text-gray-700 uppercase tracking-wide'>Tags</h3>
                                    <div className='pt-2'>
                                        <RadioGroup
                                            className="space-y-3 bg-[#D4E4F3] rounded-2xl p-4"
                                            value={filters.tag}
                                            onValueChange={(value) => handleFilterChange("tag", value)}
                                            disabled={keyword.trim() !== ""}
                                        >
                                            {tags.map((tag, index) => {
                                                const backendValue = getTagBackendValue(tag);
                                                return (
                                                    <div key={index} className="flex items-center space-x-3">
                                                        <RadioGroupItem
                                                            value={tag}
                                                            id={`tag-${backendValue}`}
                                                            className="border-2 border-gray-600 text-blue-600"
                                                        />
                                                        <Label 
                                                            htmlFor={`tag-${backendValue}`}
                                                            className="text-base font-medium text-gray-900 cursor-pointer capitalize"
                                                        >
                                                            {tag}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </RadioGroup>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </section>

            {/* Project List Section */}
            <section className='projectListSection w-full lg:w-[48rem]'>
                <div className='flex gap-2 items-center pb-5 justify-between'>
                    <div className='relative p-0 w-full'>
                        <Input
                            value={keyword}
                            onChange={handleSearchChange}
                            placeholder="Search Project"
                            className="w-full pl-12 pr-4 py-6 text-base rounded-xl bg-white/90 backdrop-blur-sm border-none shadow-md focus:shadow-lg transition-shadow text-black"
                        />
                        <Search className="absolute top-1/2 -translate-y-1/2 left-4 h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <div className='space-y-5 min-h-[74vh]'>
                    {project.loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="text-gray-700 text-lg">Loading projects...</div>
                        </div>
                    ) : project.error ? (
                        <div className="text-red-600 text-center min-h-[200px] flex items-center justify-center bg-white/80 rounded-xl p-8">
                            Error: {project.error}
                        </div>
                    ) : getProjectsToDisplay().length === 0 ? (
                        <div className="text-gray-600 text-center min-h-[200px] flex items-center justify-center bg-white/80 rounded-xl p-8">
                            {keyword.trim() ? "No projects found matching your search." : "No projects available."}
                        </div>
                    ) : (
                        getProjectsToDisplay().map((item) => (
                            <ProjectCard key={item.id} item={item} />
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}

export default ProjectList