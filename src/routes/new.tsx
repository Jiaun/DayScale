import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { ContentBlock, MobileShell, Mono } from '@/components/app/mobile-shell'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  createExpenseRecord,
  expenseCategories,
  expenseCategoryMap,
  updateExpenseRecord,
  useExpenseRecord,
} from '@/lib/app-data'
import {
  DEMO_REFERENCE_DATE,
  buildExpenseDetailView,
} from '@/lib/expense-metrics'
import { itemVariants, listVariants } from '@/lib/motion/transitions'
import { cn } from '@/lib/utils'
import type { ExpenseRecord } from '@/lib/expense-metrics'

type NewPageMode = 'create' | 'edit'

type NewPageSearch = {
  mode: NewPageMode
  id?: string
}

type ExpenseFormState = {
  name: string
  amount: string
  purchaseDate: string
  category: string
  note: string
  image: string
}

type FormErrors = Partial<
  Record<'name' | 'amount' | 'purchaseDate' | 'category', string>
>

const defaultToday = new Date().toISOString().slice(0, 10)

export const Route = createFileRoute('/new')({
  validateSearch: (search: Record<string, unknown>): NewPageSearch => ({
    mode: search.mode === 'edit' ? 'edit' : 'create',
    id: typeof search.id === 'string' ? search.id : undefined,
  }),
  component: NewRoutePage,
})

function createFormState(record?: ExpenseRecord | null): ExpenseFormState {
  if (!record) {
    return {
      name: '',
      amount: '',
      purchaseDate: defaultToday,
      category: '',
      note: '',
      image: '',
    }
  }

  const categoryName =
    expenseCategories.find((category) => category.id === record.categoryId)
      ?.name ?? ''

  return {
    name: record.name,
    amount: String(record.amount),
    purchaseDate: record.purchasedAt,
    category: categoryName,
    note: record.note,
    image: record.image,
  }
}

function validateForm(form: ExpenseFormState, today: string): FormErrors {
  const errors: FormErrors = {}
  const amount = Number(form.amount)

  if (!form.name.trim()) {
    errors.name = '请输入商品名称'
  }

  if (!form.amount.trim()) {
    errors.amount = '请输入价格'
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = '价格需要大于 0'
  }

  if (!form.purchaseDate) {
    errors.purchaseDate = '请选择购入日期'
  } else if (form.purchaseDate > today) {
    errors.purchaseDate = '购入日期不能晚于今天'
  }

  if (!form.category) {
    errors.category = '请选择分类'
  }

  return errors
}

function NewRoutePage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const isRequestedEditMode = search.mode === 'edit'
  const currentRecord = useExpenseRecord(search.id)
  const isLoadingEditRecord = isRequestedEditMode && currentRecord === undefined
  const resolvedRecord = currentRecord ?? null
  const isEditMode = isRequestedEditMode && Boolean(resolvedRecord)
  const pageTitle = isEditMode ? '编辑商品' : '新增商品'

  const [form, setForm] = useState<ExpenseFormState>(() =>
    createFormState(resolvedRecord),
  )
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [draftCategory, setDraftCategory] = useState(form.category)
  const [draftDate, setDraftDate] = useState(form.purchaseDate || defaultToday)
  const dateInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const [imageError, setImageError] = useState('')

  useEffect(() => {
    if (isLoadingEditRecord) {
      return
    }

    const nextForm = createFormState(resolvedRecord)
    setForm(nextForm)
    setDraftCategory(nextForm.category)
    setDraftDate(nextForm.purchaseDate || defaultToday)
    setFormErrors({})
    setSubmitMessage('')
    setImageError('')
  }, [resolvedRecord, isLoadingEditRecord])

  const selectedCategory = expenseCategories.find(
    (category) => category.name === form.category,
  )
  const selectedCategoryIcon = selectedCategory?.icon
  const draftCategoryIcon = expenseCategoryMap.get(draftCategory)?.icon
  const detailView =
    isEditMode && resolvedRecord
      ? buildExpenseDetailView(
          expenseCategories,
          {
            ...resolvedRecord,
            name: form.name.trim() || resolvedRecord.name,
            amount:
              Number.isFinite(Number(form.amount)) && Number(form.amount) > 0
                ? Number(form.amount)
                : resolvedRecord.amount,
            purchasedAt: form.purchaseDate || resolvedRecord.purchasedAt,
            categoryId: selectedCategory?.id ?? resolvedRecord.categoryId,
            note: form.note.trim() || resolvedRecord.note,
            image: form.image || resolvedRecord.image,
          },
          DEMO_REFERENCE_DATE,
        )
      : null

  const updateField = (
    field: keyof ExpenseFormState,
    value: ExpenseFormState[keyof ExpenseFormState],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }))
    setSubmitMessage('')
  }

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setImageError('请选择图片文件')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setImageError('图片请控制在 8MB 以内')
      return
    }

    const imageDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })

    updateField('image', imageDataUrl)
    setImageError('')
  }

  const openNativeDatePicker = () => {
    const input = dateInputRef.current
    if (!input) {
      return
    }

    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }

    input.click()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateForm(form, defaultToday)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage('')
      return
    }

    const matchedCategory = expenseCategories.find(
      (category) => category.name === form.category,
    )

    if (!matchedCategory) {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        category: '请选择分类',
      }))
      return
    }

    setSubmitting(true)

    try {
      if (isEditMode && resolvedRecord) {
        await updateExpenseRecord(resolvedRecord.id, {
          name: form.name,
          amount: Number(form.amount),
          purchasedAt: form.purchaseDate,
          categoryId: matchedCategory.id,
          note: form.note,
          image: form.image,
        })
      } else {
        await createExpenseRecord({
          name: form.name,
          amount: Number(form.amount),
          purchasedAt: form.purchaseDate,
          categoryId: matchedCategory.id,
          note: form.note,
          image: form.image,
        })
      }

      setSubmitMessage(
        isEditMode ? '商品修改已保存到本地。' : '新增商品已保存到本地。',
      )

      setImageError('')
      navigate({
        to: '/goods',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const SelectedCategoryIcon = selectedCategoryIcon
  const DraftCategoryIcon = draftCategoryIcon

  if (isRequestedEditMode && !isLoadingEditRecord && !resolvedRecord) {
    return (
      <MobileShell>
        <ContentBlock className="gap-5 px-4 pt-0 pb-6">
          <header className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-auto p-0 font-mono text-[14px] font-medium text-[#101828] hover:bg-transparent"
            >
              <Link to="/goods">‹ 返回</Link>
            </Button>
            <h1 className="w-[120px] text-center font-mono text-[18px] leading-none font-semibold tracking-[-0.02em] text-[#101828]">
              编辑商品
            </h1>
            <div className="h-5 w-[42px]" />
          </header>

          <div className="border border-[#d9dee7] bg-white px-4 py-6 text-center">
            <p className="text-[15px] font-semibold text-[#101828]">
              商品不存在
            </p>
            <p className="mt-1 text-[12px] text-[#667085]">
              这条本地商品记录可能已经被删除。
            </p>
            <Button
              asChild
              className="mt-4 h-10 rounded-none bg-[#111827] px-4 text-[13px] font-semibold text-white hover:bg-[#111827]/95"
            >
              <Link to="/goods">返回商品列表</Link>
            </Button>
          </div>
        </ContentBlock>
      </MobileShell>
    )
  }

  return (
    <MobileShell>
      <ContentBlock className="gap-5 px-4 pt-0 pb-6">
        <header className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-auto p-0 font-mono text-[14px] font-medium text-[#101828] hover:bg-transparent"
          >
            <Link to="/goods">‹ 返回</Link>
          </Button>
          <h1 className="w-[120px] text-center font-mono text-[18px] leading-none font-semibold tracking-[-0.02em] text-[#101828]">
            {pageTitle}
          </h1>
          <div className="h-5 w-[42px]" />
        </header>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">
          <motion.div
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-5"
          >
            <motion.section
              variants={itemVariants}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <Mono className="text-[12px] font-semibold text-[#667085]">
                  基础信息
                </Mono>
                <span className="text-[11px] font-medium text-[#111827]">
                  必填
                </span>
              </div>

              <div className="space-y-3 border border-[#d9dee7] bg-white p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="expense-name"
                      className="font-mono text-[14px] font-medium text-[#101828]"
                    >
                      名称
                    </label>
                    {formErrors.name ? (
                      <span className="text-[11px] text-[#d92d20]">
                        {formErrors.name}
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id="expense-name"
                    value={form.name}
                    onChange={(event) =>
                      updateField('name', event.target.value)
                    }
                    placeholder="例如：iPhone 15 Pro"
                    aria-invalid={Boolean(formErrors.name)}
                    className="h-10 border-[#d9dee7] bg-white px-3 text-[14px] text-[#101828] placeholder:text-[#98a2b3]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="expense-amount"
                      className="font-mono text-[14px] font-medium text-[#101828]"
                    >
                      价格
                    </label>
                    {formErrors.amount ? (
                      <span className="text-[11px] text-[#d92d20]">
                        {formErrors.amount}
                      </span>
                    ) : null}
                  </div>
                  <Input
                    id="expense-amount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) =>
                      updateField('amount', event.target.value)
                    }
                    placeholder="输入原始消费金额"
                    aria-invalid={Boolean(formErrors.amount)}
                    className="h-10 border-[#d9dee7] bg-white px-3 text-[14px] text-[#101828] placeholder:text-[#98a2b3]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[14px] font-medium text-[#101828]">
                      购入日期
                    </span>
                    {formErrors.purchaseDate ? (
                      <span className="text-[11px] text-[#d92d20]">
                        {formErrors.purchaseDate}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftDate(form.purchaseDate || defaultToday)
                      setDateOpen(true)
                    }}
                    className={cn(
                      'flex h-10 w-full items-center justify-between border px-3 text-left transition-colors',
                      formErrors.purchaseDate
                        ? 'border-[#d92d20] bg-[#fff5f4]'
                        : 'border-[#d9dee7] bg-white hover:bg-[#f8fafc]',
                    )}
                  >
                    <span className="font-mono text-[14px] font-medium text-[#667085]">
                      {form.purchaseDate || '请选择购入日期'}
                    </span>
                    <ChevronRight className="size-4 text-[#667085]" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[14px] font-medium text-[#101828]">
                      分类
                    </span>
                    {formErrors.category ? (
                      <span className="text-[11px] text-[#d92d20]">
                        {formErrors.category}
                      </span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftCategory(form.category)
                      setCategoryOpen(true)
                    }}
                    className={cn(
                      'flex h-10 w-full items-center justify-between border px-3 text-left transition-colors',
                      formErrors.category
                        ? 'border-[#d92d20] bg-[#fff5f4]'
                        : 'border-[#d9dee7] bg-white hover:bg-[#f8fafc]',
                    )}
                  >
                    <span className="flex items-center gap-2 font-mono text-[14px] font-medium text-[#667085]">
                      {SelectedCategoryIcon ? (
                        <SelectedCategoryIcon className="size-4 text-[#667085]" />
                      ) : null}
                      {form.category || '请选择分类'}
                    </span>
                    <ChevronRight className="size-4 text-[#667085]" />
                  </button>
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={itemVariants}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <Mono className="text-[12px] font-semibold text-[#667085]">
                  补充信息
                </Mono>
                <span className="text-[11px] font-medium text-[#667085]">
                  选填
                </span>
              </div>

              <div className="space-y-3 border border-[#d9dee7] bg-white p-3">
                <div className="space-y-2">
                  <label
                    htmlFor="expense-note"
                    className="font-mono text-[14px] font-medium text-[#101828]"
                  >
                    备注
                  </label>
                  <textarea
                    id="expense-note"
                    value={form.note}
                    onChange={(event) =>
                      updateField('note', event.target.value)
                    }
                    rows={4}
                    placeholder="补充使用场景、购买原因或保修信息"
                    className="min-h-[104px] w-full rounded-none border border-[#d9dee7] bg-white px-3 py-2.5 text-[14px] text-[#101828] outline-none placeholder:text-[#98a2b3] focus:border-ring focus:ring-1 focus:ring-ring/50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[14px] font-medium text-[#101828]">
                      图片
                    </span>
                    <span className="text-[11px] text-[#98a2b3]">
                      本地保存到 IndexedDB
                    </span>
                  </div>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                  {form.image ? (
                    <div className="space-y-2">
                      <div className="overflow-hidden border border-[#d9dee7] bg-[#eceff3]">
                        <img
                          src={form.image}
                          alt="商品图片预览"
                          className="h-[188px] w-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-none border-[#d9dee7] bg-white text-[12px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                          onClick={() => galleryInputRef.current?.click()}
                        >
                          <Upload className="size-4" />
                          重选图片
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-none border-[#d9dee7] bg-white text-[12px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                          onClick={() => cameraInputRef.current?.click()}
                        >
                          <Camera className="size-4" />
                          拍照上传
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-10 rounded-none border-[#d9dee7] bg-white text-[12px] font-semibold text-[#d92d20] hover:bg-[#fff5f4]"
                          onClick={() => {
                            updateField('image', '')
                            setImageError('')
                          }}
                        >
                          <Trash2 className="size-4" />
                          移除图片
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-none border-[#d9dee7] bg-white text-[13px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        <Upload className="size-4" />
                        选取图片
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-none border-[#d9dee7] bg-white text-[13px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <Camera className="size-4" />
                        拍照上传
                      </Button>
                    </div>
                  )}
                  {imageError ? (
                    <p className="text-[11px] text-[#d92d20]">{imageError}</p>
                  ) : (
                    <p className="text-[11px] text-[#98a2b3]">
                      当前方案将图片以本地 Data URL
                      保存，后续可迁移到远端文件存储。
                    </p>
                  )}
                </div>
              </div>
            </motion.section>

            {detailView ? (
              <motion.section
                variants={itemVariants}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <Mono className="text-[12px] font-semibold text-[#667085]">
                    详情扩展
                  </Mono>
                  <span className="text-[11px] font-medium text-[#667085]">
                    仅编辑态显示
                  </span>
                </div>

                <div className="space-y-3 border border-[#d9dee7] bg-white p-3">
                  <div className="flex items-center justify-between border-b border-[#d9dee7] pb-3">
                    <span className="font-mono text-[14px] font-medium text-[#101828]">
                      当前日均摊销
                    </span>
                    <span className="font-mono text-[14px] font-semibold text-[#111827]">
                      {detailView.dailyCost}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#d9dee7] pb-3">
                    <span className="font-mono text-[14px] font-medium text-[#101828]">
                      已持有天数
                    </span>
                    <span className="font-mono text-[14px] font-semibold text-[#101828]">
                      {detailView.daysHeld}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[12px] font-medium text-[#667085]">
                      当前物品日均摊销 / 总日均摊销占比
                    </p>
                    <div className="flex h-2.5 overflow-hidden border border-[#d9dee7] bg-[#f1f3f5]">
                      <div
                        className="h-full bg-[#101828]"
                        style={{
                          width: `${detailView.shareSegments[0]}%`,
                        }}
                      />
                      <div
                        className="h-full bg-[#98a2b3]"
                        style={{
                          width: `${detailView.shareSegments[1]}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.section>
            ) : null}

            <motion.section
              variants={itemVariants}
              className="flex w-full flex-col gap-2 pt-1"
            >
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting || isLoadingEditRecord}
                  className="h-11 flex-1 justify-between border border-[#111827] bg-[#111827] px-[14px] text-[14px] text-white hover:bg-[#111827]/95"
                >
                  {isEditMode ? '保存修改' : '新增商品'}
                  <Check className="size-4" />
                </Button>
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 justify-between border-[#d9dee7] bg-white px-[14px] text-[14px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                >
                  <Link to="/goods">取消</Link>
                </Button>
              </div>
              {submitMessage ? (
                <p className="border border-[#d9dee7] bg-[#f8fafc] px-3 py-2 text-[12px] text-[#344054]">
                  {submitMessage}
                </p>
              ) : null}
            </motion.section>
          </motion.div>
        </form>

        <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
          <DialogContent
            showCloseButton={false}
            className="max-w-[calc(100%-2rem)] gap-3 rounded-none border border-[#d9dee7] bg-white p-4 shadow-none sm:max-w-[370px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[18px] leading-tight font-semibold text-[#101828]">
                  选择分类
                </h2>
                <p className="pt-1 text-[12px] text-[#667085]">
                  基础信息为必填项，请选择一个消费分类
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="mt-[-4px] mr-[-6px] rounded-none text-[#667085] hover:bg-transparent"
                onClick={() => setCategoryOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between bg-[#111827] px-[14px] py-3">
              <span className="flex items-center gap-2 text-[15px] font-semibold text-white">
                {DraftCategoryIcon ? (
                  <DraftCategoryIcon className="size-4 text-white" />
                ) : null}
                {draftCategory || '尚未选择'}
              </span>
              <span className="text-[11px] text-white">当前选择</span>
            </div>

            <div className="border border-[#d9dee7]">
              {expenseCategories.map((option, index) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDraftCategory(option.name)}
                  className={cn(
                    'flex w-full items-center justify-between px-[14px] py-3 text-left',
                    index > 0 ? 'border-t border-[#d9dee7]' : '',
                  )}
                >
                  <span className="flex items-center gap-2 text-[14px] font-medium text-[#101828]">
                    <option.icon className="size-4 text-[#667085]" />
                    {option.name}
                  </span>
                  <ChevronRight className="size-4 text-[#667085]" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 border-[#d9dee7] bg-white text-[14px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                onClick={() => setCategoryOpen(false)}
              >
                取消
              </Button>
              <Button
                type="button"
                className="h-11 border border-[#111827] bg-[#111827] text-[14px] font-semibold text-white hover:bg-[#111827]/95"
                onClick={() => {
                  updateField('category', draftCategory)
                  setCategoryOpen(false)
                }}
              >
                确定
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={dateOpen} onOpenChange={setDateOpen}>
          <DialogContent
            showCloseButton={false}
            className="max-w-[calc(100%-2rem)] gap-3 rounded-none border border-[#d9dee7] bg-white p-4 shadow-none sm:max-w-[370px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[18px] leading-tight font-semibold text-[#101828]">
                  选择购入日期
                </h2>
                <p className="pt-1 text-[12px] text-[#667085]">
                  基础信息为必填项，按日期计算日均摊销
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="mt-[-4px] mr-[-6px] rounded-none text-[#667085] hover:bg-transparent"
                onClick={() => setDateOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between bg-[#111827] px-[14px] py-3">
              <span className="text-[15px] font-semibold text-white">
                {draftDate}
              </span>
              <span className="text-[11px] text-white">当前选择</span>
            </div>

            <div className="border border-[#d9dee7]">
              <button
                type="button"
                onClick={() => setDraftDate(defaultToday)}
                className="flex w-full items-center justify-between px-[14px] py-3 text-left"
              >
                <span className="text-[14px] font-medium text-[#101828]">
                  今天
                </span>
                <span className="text-[14px] text-[#667085]">
                  {defaultToday}
                </span>
              </button>
              <button
                type="button"
                onClick={openNativeDatePicker}
                className="flex w-full items-center justify-between border-t border-[#d9dee7] px-[14px] py-3 text-left"
              >
                <span className="text-[14px] font-medium text-[#101828]">
                  日期选择器
                </span>
                <CalendarDays className="size-4 text-[#667085]" />
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={draftDate}
                max={defaultToday}
                onChange={(event) => setDraftDate(event.target.value)}
                className="sr-only"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 border-[#d9dee7] bg-white text-[14px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                onClick={() => setDateOpen(false)}
              >
                取消
              </Button>
              <Button
                type="button"
                className="h-11 border border-[#111827] bg-[#111827] text-[14px] font-semibold text-white hover:bg-[#111827]/95"
                onClick={() => {
                  updateField('purchaseDate', draftDate)
                  setDateOpen(false)
                }}
              >
                确定
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </ContentBlock>
    </MobileShell>
  )
}
